// Ponte entre o bestiário e a mesa.
//
// Fica separado de `mesa-core.ts` de propósito: importar isto arrasta
// `monsters.json` (~900 KB) para o pacote da página. Só as abas Criaturas e
// Combate pagam esse preço; o Escudo, o Diário e as outras não.
// E o bestiário entra na versão MAGRA. `monsters.json` tem 709 KB minificados, e
// mais da metade disso é prosa: habilidades (27%), lore (24%), poderes,
// descrição, notas, conceito. Nada disso entra em conta nenhuma da mesa; é o
// texto do card, que o mestre abre para uma criatura de cada vez.
// `monsters-mesa.json` (gerado por gen-monsters.mjs) tem só o bloco de jogo:
// 271 KB minificados, 27 KB comprimidos, contra 171 KB comprimidos do inteiro.
// O card completo vem por `criaturaCompleta()`, um arquivo por criatura.
import monstersData from '../data/monsters-mesa.json';
import tecnicasData from '../data/tecnicas.json';
import artesData from '../data/artes.json';
import { resumoCombatePC } from './combate-resumo';
import { esc, u, norm, fmtDano } from './mesa-core';
import { sparkSVG } from './centelha-spark';
import { d6 } from './rolagem';
import { qaDaPeca, type QACombate } from './quase-acerto';

export const MONSTROS = monstersData as any[];
export const MON: Record<string, any> = Object.fromEntries(MONSTROS.map((m) => [m.id, m]));
export const TEC: Record<string, any> = Object.fromEntries((tecnicasData as any[]).map((t) => [t.id, t]));
export const ARTE_NOME: Record<string, string> = Object.fromEntries((artesData as any[]).map((a) => [a.id, a.nome]));

/** Índice leve para busca e listagens (sem arrastar o objeto inteiro). */
export const MON_LIST = MONSTROS.map((m) => ({
  id: m.id, nome: m.nome, nomeIngles: m.nomeIngles || '', ameaca: m.ameaca,
  centelha: m.centelha, categoria: m.categoria || '', porte: m.porte || '',
  imagem: m.imagem || '', pv: m.combate?.pv ?? null, defesa: m.combate?.defesa ?? null,
  terreno: m.ecologia?.terreno || [], clima: m.ecologia?.clima || [],
  busca: norm(`${m.nome} ${m.nomeIngles || ''} ${m.categoria || ''}`),
}));

export const ECO_TERR: Record<string, string> = {
  Cold: 'Gélido', Desert: 'Deserto', Forest: 'Floresta', Jungle: 'Selva', Mountain: 'Montanha',
  Plains: 'Planície', Swamp: 'Pântano', Underground: 'Subterrâneo', Urban: 'Urbano',
  Water: 'Aquático', Coast: 'Litoral', Sky: 'Céu', Ruins: 'Ruínas', Any: 'Qualquer',
};
export const ECO_CLIMA: Record<string, string> = {
  Cold: 'Frio', Temperate: 'Temperado', Tropical: 'Tropical', Extraplanar: 'Extraplanar',
};

const ATR: [string, string][] = [
  ['forca', 'Força'], ['destreza', 'Destreza'], ['vigor', 'Vigor'],
  ['influencia', 'Influência'], ['perspicacia', 'Perspicácia'], ['compostura', 'Compostura'],
  ['percepcao', 'Percepção'], ['inteligencia', 'Inteligência'], ['raciocinio', 'Raciocínio'],
];
const AP_CURVA: Record<number, number> = { 1: -4, 2: -2, 3: -1, 4: 0, 5: 0, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4 };
const apMod = (n: number) => (n > 10 ? 4 + (n - 10) : n < 1 ? -5 - (0 - n) : (AP_CURVA[n] ?? 0));
export const estrelas = (a: number) => '★'.repeat(a) + '☆'.repeat(Math.max(0, 6 - a));

/** Dado de iniciativa da criatura: 1d6 + o bônus escrito no bloco. */
export function iniDeMonstro(m: any): number {
  const s = m?.combate?.iniciativa || '';
  const mt = /([+-]?\s*\d+)\s*$/.exec(String(s).replace(/\dd6/, ''));
  const bonus = mt ? parseInt(mt[1].replace(/\s/g, ''), 10) : 0;
  return d6() + (isNaN(bonus) ? 0 : bonus);
}
// O dado mora em `rolagem.ts` agora, com o resto do acaso do combate. Fica
// reexportado porque meia dúzia de telas o importam daqui.
export { d6 };

export interface ResumoCombate {
  arma: string; ataque: string; dano: string; defesa: number | null;
  defesaSocial?: number | null; defesaMental?: number | null;
  soak: { impacto: number; corte: number; perfuracao: number };
  resistPerf: number; velocidade?: number | null;
  qa?: QACombate;
}

/** Bloco de combate de origem: da ficha (PC) ou do bestiário (criatura). */
export function baseResumo(c: any, fichaPorId: Record<string, any> = {}): ResumoCombate | null {
  if (c.tipo === 'pc' && fichaPorId[c.personagem_id]) {
    try {
      const r = resumoCombatePC(fichaPorId[c.personagem_id]) as any;
      return { ...r, velocidade: null };
    } catch { return null; }
  }
  if (c.tipo === 'criatura') {
    const cb = MON[c.monstro_id]?.combate || {};
    const a0 = (cb.ataques || [])[0];
    const ab = cb.absorcao;
    return {
      arma: a0?.nome || '', ataque: a0?.pool || '', dano: a0 ? fmtDano(a0.dano) : '',
      defesa: cb.defesa ?? null, defesaSocial: cb.defesaSocial ?? null, defesaMental: cb.defesaMental ?? null,
      soak: ab ? { impacto: ab.impacto || 0, corte: ab.corte || 0, perfuracao: ab.perfuracao || 0 }
                : { impacto: 0, corte: 0, perfuracao: 0 },
      resistPerf: cb.resistenciaPerfuracao || 0,
      velocidade: a0?.speed ?? null,
      // A criatura não tem armadura vestida (ver `QACombate`): só a metade da
      // arma sai preenchida. O dano médio dela vem da própria expressão de dano,
      // porque ali a expressão É a arma.
      qa: qaDaPeca(a0?.nome || '', a0 ? fmtDano(a0.dano) : '', null),
    };
  }
  return null;
}

/**
 * Mescla o bloco de origem com os ajustes por instância que o mestre salvou em
 * `combatentes.dados`. O ajuste sempre vence: é ele que diz "este ogro aqui é o
 * chefe e tem 4 a mais de Absorção".
 */
export function resumoDe(c: any, fichaPorId: Record<string, any> = {}): ResumoCombate | null {
  const base = baseResumo(c, fichaPorId);
  const ov = (c.dados && typeof c.dados === 'object') ? c.dados : {};
  if (!base && !Object.keys(ov).length) return null;
  const bs = base?.soak || ({} as any); const os = ov.soak || {};
  return {
    arma: ov.arma ?? base?.arma ?? '',
    ataque: ov.ataque ?? base?.ataque ?? '',
    dano: ov.dano ?? base?.dano ?? '',
    defesa: ov.defesa ?? base?.defesa ?? null,
    defesaSocial: ov.defesaSocial ?? base?.defesaSocial ?? null,
    defesaMental: ov.defesaMental ?? base?.defesaMental ?? null,
    soak: {
      impacto: os.impacto ?? bs.impacto ?? 0,
      corte: os.corte ?? bs.corte ?? 0,
      perfuracao: os.perfuracao ?? bs.perfuracao ?? 0,
    },
    resistPerf: ov.resistPerf ?? base?.resistPerf ?? 0,
    velocidade: ov.velocidade ?? base?.velocidade ?? null,
    // O QUASE-ACERTO SEGUE A ARMA que o ajuste escolheu. Trocar a arma do goblin
    // por um martelo e deixar o raspão da adaga seria a mesma incoerência que o
    // `ataque` e o `dano` já evitam vindo do mesmo lugar. E `dados.qa` continua
    // podendo escrever por cima dos quatro números, um a um, que é como o
    // cavaleiro de placa construído como criatura se conserta.
    qa: { ...qaDaPeca(ov.arma ?? base?.arma, ov.dano ?? base?.dano,
      (ov.armaduras ?? null) as any), ...(ov.qa || {}) },
  };
}

/**
 * A criatura INTEIRA, com a prosa que a versão magra não carrega.
 *
 * Busca `/dados/criatura/<id>.json` (arquivo estático gerado no build) e guarda
 * o que veio: abrir o card do mesmo goblin dez vezes numa sessão custa uma ida à
 * rede. Falhando a busca, devolve o que a mesa já tem, e o card sai sem o texto
 * em vez de não sair.
 */
const CACHE_CRIATURA = new Map<string, any>();
export async function criaturaCompleta(id: string): Promise<any> {
  if (!id) return null;
  if (CACHE_CRIATURA.has(id)) return CACHE_CRIATURA.get(id);
  const base = MON[id] || null;
  try {
    const r = await fetch(u(`dados/criatura/${encodeURIComponent(id)}.json`));
    if (r.ok) {
      const cheia = await r.json();
      CACHE_CRIATURA.set(id, cheia);
      return cheia;
    }
  } catch {}
  // Não guarda a falha: a próxima tentativa pode dar certo (rede que voltou).
  return base;
}

/** Card completo da criatura, o mesmo do bestiário. Serve ao modal das três abas. */
export function cardCriaturaHTML(m: any): string {
  const cb = m.combate || {};
  const en = m.nomeIngles && m.nomeIngles.toLowerCase() !== m.nome.toLowerCase()
    ? ` <span class="besta-nome-en">(${esc(m.nomeIngles)})</span>` : '';
  const arte = m.imagem
    ? `<figure class="arte"><img src="${u(m.imagem)}" alt="${esc(m.nome)}" /><span class="arte-ameaca" title="Ameaça ${m.ameaca}/6">${estrelas(m.ameaca)}</span>${m.centelha > 0 ? `<span class="arte-cent">${sparkSVG(true)} ${m.centelha}</span>` : ''}</figure>`
    : `<figure class="arte sem-arte"><span class="capitular cinzel">${esc((m.nome || '?').trim()[0])}</span><span class="arte-ameaca">${estrelas(m.ameaca)}</span></figure>`;
  const badges = `${m.categoria ? `<span class="badge cat">${esc(m.categoria)}</span>` : ''}${(m.ecologia?.terreno || []).map((t: string) => `<span class="badge terr">${esc(ECO_TERR[t] || t)}</span>`).join('')}${(m.ecologia?.clima || []).map((c: string) => `<span class="badge clima">${esc(ECO_CLIMA[c] || c)}</span>`).join('')}`;
  const porte = m.porte ? `<p class="besta-porte"><span class="pt-lbl">Porte</span><span class="pt-cat">${esc(m.porte)}</span><span class="pt-sep">·</span>${esc(m.dimensoes?.medida || '')}<span class="pt-sep">·</span>${esc(m.dimensoes?.peso || '')}</p>` : '';
  const abs = cb.absorcao ? `${cb.absorcao.impacto}/${cb.absorcao.corte}/${cb.absorcao.perfuracao}${cb.resistenciaPerfuracao ? `·N${cb.resistenciaPerfuracao}` : ''}` : '-';
  const stat = (dt: string, dd: any) => `<div><dt>${dt}</dt><dd>${dd ?? '-'}</dd></div>`;
  const stats = `<dl class="besta-stats">${stat('PV', cb.pv)}${stat('Defesa', cb.defesa)}${stat('Def. Social', cb.defesaSocial)}${stat('Def. Mental', cb.defesaMental)}${stat('Absorção', abs)}${stat('Iniciativa', esc(cb.iniciativa || '-'))}</dl>`;
  const atrib = m.atributos ? `<div class="besta-atrib"><span class="atr-lbl">Atributos</span><div class="atr-grid">${ATR.map(([k, full]) => `<span class="atr"><span class="atr-nm">${full}</span><span class="atr-v">${m.atributos[k] ?? 0}</span></span>`).join('')}</div></div>` : '';
  const tracos = m.virtudes ? `<div class="besta-tracos"><div class="tr-linha"><span class="tr"><span class="tr-nm">Vontade</span><span class="tr-v">${m.vontade ?? '-'}</span></span><span class="tr"><span class="tr-nm">Aparência</span><span class="tr-v">${m.aparencia ?? '-'} <small class="tr-mod">(${apMod(m.aparencia) >= 0 ? '+' : ''}${apMod(m.aparencia)})</small></span></span></div><div class="tr-virt"><span class="tr-nm">Virtudes</span><span class="tr-vv">Comp ${m.virtudes.compaixao} · Conv ${m.virtudes.conviccao} · Temp ${m.virtudes.temperanca} · Val ${m.virtudes.valor}</span></div></div>` : '';
  const elem = (m.fraquezas?.length || m.resistencias?.length)
    ? `<div class="besta-elem">${(m.fraquezas || []).map((f: string) => `<span class="el el-fraco" title="Fraqueza">▼ ${esc(f)}</span>`).join('')}${(m.resistencias || []).map((r: string) => `<span class="el el-forte" title="Resistência">▲ ${esc(r)}</span>`).join('')}</div>` : '';
  const atk = (cb.ataques || []).length ? `<ul class="besta-atk">${cb.ataques.map((a: any) => `<li><span class="atk-nome">${esc(a.nome)}</span><span class="atk-rolls">Ataque: <b>${esc(a.pool)}</b> · Dano <b>${fmtDano(esc(a.dano))}</b> · Velocidade ${a.speed}</span>${a.notas ? `<span class="atk-nota muted">${esc(a.notas)}</span>` : ''}</li>`).join('')}</ul>` : '';
  const habs = (m.habilidades || []).length ? `<h4 class="cc-h">Habilidades</h4><ul class="ib-hab">${m.habilidades.map((h: any) => `<li><b>${esc(h.nome)}</b> ${esc(h.descricao)}</li>`).join('')}</ul>` : '';
  const pods = (m.poderes || []).length ? `<h4 class="cc-h">Poderes <span class="muted">(sistema)</span></h4><ul class="ib-pod">${m.poderes.map((p: any) => `<li><span class="pw-ef">${esc(p.efeito)}</span> → <span class="pw-alvo">${esc(p.alvo)}</span></li>`).join('')}</ul>` : '';
  const refTec = (m.tecnicas || []).length ? `<p class="ib-ref"><b>Técnicas:</b> ${m.tecnicas.map((t: string) => `<a href="${u('caminhos/' + (TEC[t]?.caminho || ''))}#${t}">${esc(TEC[t]?.nome || t)}</a>`).join(' · ')}</p>` : '';
  const refArte = (m.artes || []).length ? `<p class="ib-ref"><b>Artes:</b> ${m.artes.map((a: any) => `<a href="${u('arcano')}#${a.id}">${esc(ARTE_NOME[a.id] || a.id)}</a> ${a.nivel}`).join(' · ')}</p>` : '';
  const refs = (refTec || refArte) ? `<h4 class="cc-h">Técnicas &amp; Artes</h4>${refTec}${refArte}` : '';
  const notas = m.notas ? `<h4 class="cc-h">Notas</h4><p class="ib-notas">${esc(m.notas)}</p>` : '';
  const lore = (m.lore || []).length ? `<h4 class="cc-h">Informações</h4>${m.lore.map((s: any) => `<div class="ib-lore"><h5>${esc(s.titulo)}</h5><p>${esc(s.texto)}</p></div>`).join('')}` : '';
  return `<article class="besta cc-besta">${arte}<div class="besta-corpo">
    <header class="besta-head"><span class="besta-nome cinzel">${esc(m.nome)}${en}</span></header>
    ${badges ? `<div class="besta-badges">${badges}</div>` : ''}
    ${porte}${m.descricao ? `<p class="besta-con muted">${esc(m.descricao)}</p>` : ''}
    ${stats}${elem}${atrib}${tracos}${atk}${habs}${pods}${refs}${notas}${lore}
  </div></article>`;
}
