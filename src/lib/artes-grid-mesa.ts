// As Artes dentro do tabuleiro: conjurar, desenhar, cobrar a mordida e expirar.
//
// Este arquivo é a cola entre o motor (`artes-grid.ts`, que só calcula), a tela
// (`artes-grid-ui.ts`, que só pergunta) e a aba Grid, que é dona do Supabase e
// dos hexágonos. A aba entrega um contexto e chama quatro funções; tudo o mais
// mora aqui, e é por isso que `grid.astro` quase não muda para ganhar isso.
import { esc, novoId, somarCondicoes, COND, tierDe } from './mesa-core';
import { MON } from './mesa-bestiario';
import { uiErro, uiConfirmar, uiEscolher } from './ui-dialog';
import {
  EFEITO, ARTE, CONDICAO, hexesDoEfeito, hexesNoRaio, danoNoAlvo, rolar,
  turnosRestantes, venceu, jaMordido, rodadaDoTick, dentroDoEfeito,
  rotuloDuracao, TICKS_POR_TURNO, type EfeitoAtivo, type Forma,
} from './artes-grid';
import {
  abrirConjuracao, abrirNPC, abrirEmpurroes, escolherItem, itensDoAlvo,
  npcVazio, type Plano, type Empurrado,
} from './artes-grid-ui';
import {
  centroHex, verticesHex, margemTabuleiro, medidaTabuleiro, distanciaHex, nomeHex, type Hex,
} from './hex';

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
  logar: (c: any, txt: string, extra: Record<string, any>) => Promise<void>;
  recarregar: () => Promise<void>;
  repintar: () => void;
}

let ATIVOS: EfeitoAtivo[] = [];
export const efeitosAtivos = () => ATIVOS;

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
  const med = medidaTabuleiro(ctx.arena.cols, ctx.arena.rows, ctx.raio);
  svg.setAttribute('viewBox', `0 0 ${med.largura} ${med.altura}`);
}

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
  const mg = margemTabuleiro(ctx.raio);
  const vivos = ATIVOS.filter((e) => !venceu(e, t));
  svg.innerHTML = vivos.map((ef) => {
    const cor = corDe(ef);
    const casas = (ef.hexes || []).map((h) => {
      const c = centroHex(h.q, h.r, ctx.raio);
      // 0,94 do raio deixa um fio de chão entre casas vizinhas: sem isso a
      // mancha vira um borrão e ninguém conta quantos hexágonos ela cobre.
      return `<polygon points="${verticesHex(c.x + mg.x, c.y + mg.y, ctx.raio * 0.94)}" />`;
    }).join('');
    const restam = turnosRestantes(ef, t);
    return `<g class="gr-ef gr-ef-${esc(ef.forma)}" data-ef="${esc(ef.id)}"
      style="--ef-cor:${cor}" opacity="${restam <= 1 ? 0.55 : 1}">
      <title>${esc(ef.nome)} · ${esc(rotuloDuracao(restam))}</title>${casas}</g>`;
  }).join('');
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
      ? (ef.alvos || []) : dentroDoEfeito(ef, ctx.tokens);
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
 * Espera um clique num hexágono, com a prévia da mancha seguindo o ponteiro.
 *
 * A fase de captura é a mesma escolha que a mira de ataque faz: sem ela o
 * ponteiro começaria a arrastar a peça que estivesse embaixo do alvo.
 */
function escolherNoMapa(
  ctx: CtxGrid, palco: HTMLElement, previa: (h: Hex) => Hex[], aviso: string,
): Promise<Hex | null> {
  return new Promise((resolve) => {
    const svg = document.getElementById('gr-previa') as unknown as SVGElement | null;
    const mg = margemTabuleiro(ctx.raio);
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
    const desenhar = (h: Hex) => {
      if (!svg) return;
      svg.innerHTML = previa(h).map((x) => {
        const c = centroHex(x.q, x.r, ctx.raio);
        return `<polygon points="${verticesHex(c.x + mg.x, c.y + mg.y, ctx.raio * 0.94)}" />`;
      }).join('');
    };
    const moveu = (ev: PointerEvent) => {
      const h = ctx.hexNaTela(ev.clientX, ev.clientY);
      if (h) desenhar(h);
    };
    const clicou = (ev: PointerEvent) => {
      ev.preventDefault(); ev.stopPropagation();
      const h = ctx.hexNaTela(ev.clientX, ev.clientY);
      limpar(); resolve(h);
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { limpar(); resolve(null); } };
    palco.addEventListener('pointerdown', clicou, true);
    document.addEventListener('pointermove', moveu);
    document.addEventListener('keydown', tecla);
  });
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
  const plano = await abrirConjuracao({ nome: c.nome, centelha, fonte, comprados });
  if (!plano) return;

  const g = plano.efeito?.grid;
  const forma: Forma = g?.forma || (plano.areaM2 ? 'zona' : 'alvo');

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
}

/** Aura, zona, muro, cone e linha: tudo o que ocupa chão. */
async function marcarNoChao(ctx: CtxGrid, c: any, plano: Plano, palco: HTMLElement, forma: Forma): Promise<void> {
  const meu = ctx.tokens[c.id];
  if (!meu) return uiErro('Ponha o conjurador no mapa antes: a Arte sai de onde ele está.');
  const esc_ = escalaM(ctx);
  const cols = ctx.arena.cols, rows = ctx.arena.rows;
  const g = plano.efeito?.grid;
  const calc = (centro: Hex, mira: Hex | null) => hexesDoEfeito({
    forma, molde: plano.molde, centro, mira, escalaM: esc_, cols, rows,
    areaM2: plano.areaM2, raioM: plano.raioM, comprimentoM: plano.comprimentoM,
    arenaInteira: g?.arenaInteira,
  });

  let centro: Hex = meu;
  let mira: Hex | null = null;
  // Escala de região cobre tudo: não há onde clicar, e perguntar seria teatro.
  if (g?.arenaInteira) {
    await gravarEfeito(ctx, c, plano, {
      forma, hexes: calc(meu, null), centro: null, raio_m: null, alvos: [],
    });
    return;
  }
  if (forma === 'aura') {
    // A aura nasce presa ao conjurador: não há onde clicar.
  } else if (forma === 'cone' || forma === 'linha' || forma === 'muro') {
    mira = await escolherNoMapa(ctx, palco, (h) => calc(meu, h), 'Aponte a direção · Esc cancela');
    if (!mira) return;
  } else {
    const ponto = await escolherNoMapa(ctx, palco, (h) => calc(h, null),
      `Onde cai ${plano.nome} · Esc cancela`);
    if (!ponto) return;
    // O Alcance é do livro, e vale a pena cobrar: uma zona posta a 50 m com
    // Alcance 1 seria um efeito de graça.
    const dist = distanciaHex(meu, ponto) * esc_;
    if (plano.alcanceM && dist > plano.alcanceM + 1e-9) {
      const segue = await uiConfirmar(
        `${plano.nome} tem Alcance de ${plano.alcanceM} m e você apontou a ${dist.toFixed(1)} m. Conjurar assim mesmo?`,
        { titulo: 'Fora de alcance', ok: 'Conjurar' });
      if (!segue) return;
    }
    centro = ponto;
    if (plano.molde !== 'circulo') {
      mira = await escolherNoMapa(ctx, palco, (h) => calc(centro, h), 'Aponte a direção · Esc cancela');
      if (!mira) return;
    }
  }

  const hexes = calc(centro, mira);
  await gravarEfeito(ctx, c, plano, {
    forma, hexes, centro, raio_m: forma === 'aura' ? plano.raioM : null, alvos: [],
  });
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

  await gravarEfeito(ctx, c, plano, {
    forma: 'alvo', hexes: [], centro: null, raio_m: null, alvos: [alvoId], item,
  });

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

  await gravarEfeito(ctx, c, plano, {
    forma: 'cadeia', hexes: cadeia.map((id) => ctx.tokens[id]).filter(Boolean) as Hex[],
    centro: ctx.tokens[primeiro] || null, raio_m: null, alvos: cadeia,
  });
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
      forma: 'token', hexes: [], centro: null, raio_m: null,
      alvos: [novo.id], item: null, turnos: d.turnos,
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
  forma: Forma; hexes: Hex[]; centro: Hex | null; raio_m: number | null;
  alvos: string[]; item?: string | null; turnos?: number;
}): Promise<void> {
  const g = plano.efeito?.grid;
  const t = tickAtual(ctx);
  const turnos = extra.turnos ?? plano.turnos;
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
    hexes: extra.hexes.map((h) => ({ q: h.q, r: h.r })),
    centro: extra.centro ? { q: extra.centro.q, r: extra.centro.r } : null,
    raio_m: extra.raio_m,
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
    return uiErro(/arena_efeitos/i.test(error.message)
      ? 'A tabela das Artes ainda não existe. Rode supabase/migracao-19.sql no SQL Editor.'
      : 'Erro ao gravar o efeito: ' + error.message);
  }
  ATIVOS.push({ ...(data || [])[0], mordidos: {} } as EfeitoAtivo);

  // A condição entra já em quem foi marcado de saída (melhoria e marca).
  if (g?.condicao) for (const id of extra.alvos) await porCondicao(ctx, combDe(ctx, id), g.condicao, turnos);

  await ctx.logar(c, `${c.nome} conjurou ${plano.resumo}`
    + (extra.centro ? ` em ${nomeHex(extra.centro.q, extra.centro.r)}` : '')
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
async function morder(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any, verbo: string): Promise<void> {
  if (!ef || !alvo) return;
  const rolagem = rolar(ef.dano_dados);
  const bruto = rolagem.total + (ef.dano_bonus || 0);
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

  // 1. o que venceu sai de cena, e leva a condição junto
  for (const ef of ATIVOS.filter((e) => venceu(e, t))) await encerrarEfeito(ctx, ef, 'venceu o prazo');

  // 2. quem está pego e ainda não sofreu a mordida nesta rodada
  const pendentes: { ef: EfeitoAtivo; alvo: any }[] = [];
  for (const ef of ATIVOS) {
    if (!ef.dano_dados && !ef.condicao) continue;
    if (ef.gatilho === 'armadilha' || ef.gatilho === 'passivo' || ef.gatilho === 'ao-tocar') continue;
    const dentro = ef.forma === 'alvo' || ef.forma === 'token'
      ? (ef.alvos || []) : dentroDoEfeito(ef, ctx.tokens);
    for (const cid of dentro) {
      if (cid === ef.conjurador_id && ef.forma === 'aura') continue;   // a própria aura não queima o dono
      if (jaMordido(ef, cid, t)) continue;
      const alvo = combDe(ctx, cid);
      if (alvo) pendentes.push({ ef, alvo });
    }
  }
  if (!pendentes.length) { ctx.repintar(); return; }

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

  if (!escolha) { ctx.repintar(); return; }
  const alvos = escolha === '__todos' ? pendentes : [pendentes[Number(escolha)]];
  for (const p of alvos) {
    if (p.ef.dano_dados) await morder(ctx, p.ef, p.alvo, 'pegou');
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
      ? (ef.alvos || []) : dentroDoEfeito(ef, ctx.tokens);
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
