// A ficha resumida: um card de leitura, no formato do card de criatura.
//
// A ficha completa é uma ferramenta de construção, com cada campo editável e
// cada linha do catálogo à vista. Serve para montar o personagem e é péssima
// para consultá-lo: no meio de uma cena ninguém quer rolar por 66 perícias
// secundárias em branco para descobrir que o sujeito tem Halterofilismo 3.
//
// Este card mostra só o que EXISTE. Perícia zerada não aparece, Arte não
// comprada não aparece, saco de itens não aparece. O que sobra cabe numa tela e
// responde as perguntas que se fazem na mesa: quanto ele aguenta, quanto ele
// acerta, o que ele sabe fazer.
//
// O vocabulário visual é o do card de criatura (`cardCriaturaHTML`), de
// propósito: mestre e jogador leem os dois lado a lado o tempo todo, e duas
// gramáticas diferentes para a mesma informação custam um pensamento a cada
// troca de olhar.
import { resumoFicha } from './mesa-ficha';
import { armaDoSlot, escudoDoSlot, armadurasDe, statsArma, statsEscudo, statsArmadura, ARMA } from './equip';
import { sparkSVG } from './centelha-spark';
import { MODULOS } from './modulos';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const BASE = import.meta.env.BASE_URL;
const u = (p: string) => `${BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;

// ------------------------------------------------------------- dicionário
export interface NomesFicha {
  atr: [string, string, string][]; hab: [string, string][]; vir: [string, string][];
  sec: Record<string, string>; cam: Record<string, string>;
  tec: Record<string, [string, string, number]>; efe: Record<string, [string, number]>;
  art: Record<string, string>;
}
let NOMES: NomesFicha | null = null;
/** Busca o dicionário de nomes uma vez por sessão. */
export async function carregarNomes(): Promise<NomesFicha> {
  if (NOMES) return NOMES;
  const r = await fetch(u('dados/nomes-ficha.json'));
  NOMES = await r.json();
  return NOMES!;
}
/** Sem o dicionário, o id vira uma etiqueta legível em vez de sumir. */
const bonito = (id: string) => String(id || '').replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

// ------------------------------------------------------------- pedacinhos
const stat = (dt: string, dd: unknown) => `<div><dt>${dt}</dt><dd>${dd ?? '—'}</dd></div>`;
const chip = (txt: string, dica = '') => `<span class="fr-chip"${dica ? ` title="${esc(dica)}"` : ''}>${txt}</span>`;
const secao = (titulo: string, corpo: string) => (corpo ? `<h4 class="fr-h">${titulo}</h4>${corpo}` : '');

/** Nome + nível/valor, em pastilha. Usado por perícias, proezas, Artes e Efeitos. */
const listaChips = (itens: { nome: string; v?: number | string; dica?: string }[]) =>
  itens.length ? `<div class="fr-chips">${itens.map((i) =>
    chip(`${esc(i.nome)}${i.v != null && i.v !== '' ? ` <b>${esc(i.v)}</b>` : ''}`, i.dica || '')).join('')}</div>` : '';

/**
 * As armas do personagem, do jeito que a ficha as calcula.
 *
 * O conjunto ATIVO vem primeiro e com os números prontos (é com ele que se
 * rola); o resto do arsenal vem depois como inventário, com a linha de
 * estatísticas da arma crua, porque o acerto depende de quem empunha e não
 * caberia repetir a conta para cada peça guardada na mochila.
 */
function blocoEquipamento(S: any, R: any) {
  const linhas: string[] = [];
  const cj = Array.isArray(S?.conjuntos) && S.conjuntos.length
    ? (S.conjuntos.find((c: any) => c.ativo) || S.conjuntos[0]) : null;
  const mao = (slot: any) => {
    if (!slot || (slot.ref || 'nada') === 'nada') return null;
    return armaDoSlot(slot) || escudoDoSlot(slot) || null;
  };
  const habil = cj ? mao(cj.habil) : (ARMA[S?.equip?.arma || ''] || null);
  const inabil = cj ? mao(cj.inabil) : null;

  if (R.arma || habil) {
    linhas.push(`<li><span class="fr-eq-n">${esc(R.arma || habil?.nome || 'Desarmado')}</span>
      <span class="fr-eq-v">Acerto <b>${esc(R.ataque || '—')}</b> · Dano <b>${esc(R.dano || '—')}</b></span>
      ${habil && habil.ticks != null ? `<span class="fr-eq-s">${esc(statsArma(habil))} <small>vel/acerto/dano/def</small></span>` : ''}</li>`);
  }
  if (inabil) {
    const ehEscudo = inabil.bloqCaC != null || inabil.penalidade != null && inabil.ticks == null;
    linhas.push(`<li><span class="fr-eq-n">${esc(inabil.nome)} <small>(mão inábil)</small></span>
      <span class="fr-eq-s">${esc(ehEscudo ? statsEscudo(inabil) : statsArma(inabil))}</span></li>`);
  }
  for (const a of armadurasDe(S)) {
    linhas.push(`<li><span class="fr-eq-n">${esc(a.nome)}</span><span class="fr-eq-s">${esc(statsArmadura(a))}</span></li>`);
  }
  // O arsenal é o que ele POSSUI; o conjunto é o que ele está segurando. Só
  // aparece o que não está em uso, senão a mesma espada sai duas vezes.
  const emUso = new Set([cj?.habil?.uid, cj?.inabil?.uid].filter(Boolean));
  const guardadas = (S?.arsenal || []).filter((p: any) => !emUso.has(p.uid));
  const extra = guardadas.length
    ? `<div class="fr-chips fr-guardado">${guardadas.map((p: any) => {
        const w = armaDoSlot(p) || escudoDoSlot(p);
        return chip(esc(p.nome || w?.nome || bonito(String(p.ref || '').replace(/^[ae]:/, ''))),
          w && w.ticks != null ? statsArma(w) : (w ? statsEscudo(w) : ''));
      }).join('')}</div>` : '';

  if (!linhas.length && !extra) return '';
  return `${linhas.length ? `<ul class="fr-eq">${linhas.join('')}</ul>` : ''}
    ${extra ? `<p class="fr-sub">Guardado</p>${extra}` : ''}`;
}

/**
 * Monta o card. `S` é a ficha crua; o resto é o que a ficha não sabe de si
 * (o retrato assinado, o nome da mesa).
 */
export function cardFichaHTML(
  S: any,
  opts: { retrato?: string | null; mesa?: string; nome?: string; pos?: { x?: number; y?: number; z?: number } | null } = {},
) {
  const N = NOMES;
  const R = resumoFicha(S || {});
  const nome = opts.nome || S?.id?.nome || 'Personagem';

  // O mesmo enquadramento que o jogador ajustou na página do personagem: sem
  // ele, um retrato de corpo inteiro entra cortado na altura da cintura. E é
  // por isso que a moldura aqui é a `.retrato-frame` de global.css, a mesma da
  // ficha e dos cards de Mesas / Fichas: o x/y/z foi calibrado NAQUELA caixa,
  // e numa de outra proporção o recorte sai deslocado.
  const q = opts.pos && typeof opts.pos === 'object' ? opts.pos : null;
  const px = q?.x ?? 50, py = q?.y ?? 30, pz = q?.z ?? 1;
  const estiloArte = ` style="object-position:${px}% ${py}%;transform-origin:${px}% ${py}%;transform:scale(${pz})"`;

  // A faísca da marca, montada em runtime, como no card de criatura.
  const cent = R.centelha
    ? `<span class="fr-cent" title="Centelha ${R.centelha}">${sparkSVG(true)} ${R.centelha}</span>` : '';
  const arte = opts.retrato
    ? `<figure class="fr-arte retrato-frame"><img src="${esc(opts.retrato)}" alt="${esc(nome)}"${estiloArte} />${cent}</figure>`
    : `<figure class="fr-arte retrato-frame sem-arte"><span class="fr-capitular cinzel">${esc(nome.trim()[0] || '?')}</span>${cent}</figure>`;

  const badges = [
    R.raca ? `<span class="fr-badge cat">${esc(bonito(R.raca))}</span>` : '',
    opts.mesa ? `<span class="fr-badge">${esc(opts.mesa)}</span>` : '',
    S?.id?.jogador ? `<span class="fr-badge">${esc(S.id.jogador)}</span>` : '',
    S?.id?.titulo ? `<span class="fr-badge">${esc(S.id.titulo)}</span>` : '',
  ].filter(Boolean).join('');

  // Rótulos de uma palavra: com onze quadradinhos numa faixa, "Def. Social"
  // quebra em duas linhas e desalinha o número dos vizinhos. As duas defesas
  // não precisam do "Def." porque estão entre Esquiva e Bloqueio.
  const stats = `<dl class="fr-stats">
    ${stat('Vida', R.pv)}${stat('Energia', R.energia)}${stat('Mana', R.mana)}${MODULOS.folego ? stat('Fôlego', R.folego) : ''}
    ${stat('Esquiva', R.defEsquiva)}${stat('Bloqueio', R.defBloqueio)}
    ${stat('Social', R.defSocial)}${stat('Mental', R.defMental)}
    ${stat('Absorção', `${R.soak.impacto}/${R.soak.corte}/${R.soak.perfuracao}${R.resistPerf ? `·N${R.resistPerf}` : ''}`)}
    ${stat('Iniciativa', esc(R.iniciativa))}
    ${R.penFisica ? stat('Penalid.', `−${R.penFisica}`) : ''}
  </dl>`;

  // Atributos nos três grupos da ficha, na mesma ordem de sempre.
  const grupos = ['fisico', 'social', 'mental'];
  const rotGrupo: Record<string, string> = { fisico: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const atrib = `<div class="fr-atr-grid">${grupos.map((g) => {
    const linha = (N?.atr || []).filter((a) => a[2] === g);
    if (!linha.length) return '';
    return `<div class="fr-atr-col"><span class="fr-atr-g">${rotGrupo[g] || g}</span>
      ${linha.map(([id, rot]) => `<span class="fr-atr"><span class="fr-atr-n">${esc(rot)}</span><span class="fr-atr-v">${R.attrs[id] ?? 0}</span></span>`).join('')}</div>`;
  }).join('')}</div>`;

  const virt = (N?.vir || []).map(([id, rot]) => `${esc(rot)} <b>${R.virtudes[id] ?? 0}</b>`).join(' · ');
  const tracos = `<div class="fr-tracos">
    <span class="fr-tr">Vontade <b>${R.vontade}</b></span>
    <span class="fr-tr">Aparência <b>${R.aparencia}</b></span>
    ${R.centelha ? `<span class="fr-tr">Centelha <b>${R.centelha}</b></span>` : ''}
    ${virt ? `<span class="fr-tr fr-tr-virt">${virt}</span>` : ''}
  </div>`;

  // ---- perícias: só as que ele tem ----
  const espec = (lista: any) => (Array.isArray(lista) && lista.length ? lista.filter(Boolean).join(', ') : '');
  const habs = (N?.hab || [])
    .filter(([id]) => (R.skills[id] || 0) > 0)
    .map(([id, rot]) => ({ nome: rot, v: R.skills[id], dica: espec(S?.spec?.[id]) ? `Especialidades: ${espec(S.spec[id])}` : '' }));
  const secs = Object.entries(R.skills2 || {})
    .filter(([, v]) => (v as number) > 0)
    .map(([id, v]) => ({
      nome: S?.livreNome?.[id] || N?.sec[id] || bonito(id),
      v: v as number,
      dica: espec(S?.spec2?.[id]) ? `Especialidades: ${espec(S.spec2[id])}` : '',
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  // ---- proezas, agrupadas pelo Caminho ----
  const porCaminho: Record<string, { nome: string; v: number }[]> = {};
  for (const id of R.tecnicas) {
    const t = N?.tec[id];
    const cam = t?.[1] || 'outros';
    (porCaminho[cam] ||= []).push({ nome: t?.[0] || bonito(id), v: t?.[2] || 0 });
  }
  const proezas = Object.keys(porCaminho).sort().map((cam) => {
    const itens = porCaminho[cam].sort((a, b) => (a.v - b.v) || a.nome.localeCompare(b.nome));
    return `<div class="fr-cam"><span class="fr-cam-n">${esc(N?.cam[cam] || bonito(cam))}</span>
      ${listaChips(itens.map((i) => ({ nome: i.nome, v: i.v ? `N${i.v}` : '' })))}</div>`;
  }).join('');

  // ---- Artes e Efeitos ----
  const artes = listaChips(R.artes.map((a) => ({ nome: N?.art[a.id] || bonito(a.id), v: a.nivel })));
  const efeitosIds = Object.keys(S?.efeito || {}).filter((k) => S.efeito[k]);
  const efeitos = listaChips(efeitosIds
    .map((id) => ({ nome: N?.efe[id]?.[0] || bonito(id), v: N?.efe[id]?.[1] ? `N${N.efe[id][1]}` : '' }))
    .sort((a, b) => a.nome.localeCompare(b.nome)));

  return `<article class="fr-card">
    ${arte}
    <div class="fr-corpo">
      <header class="fr-head">
        <span class="fr-nome cinzel">${esc(nome)}</span>
        ${S?.id?.conceito ? `<span class="fr-con">${esc(S.id.conceito)}</span>` : ''}
      </header>
      ${badges ? `<div class="fr-badges">${badges}</div>` : ''}
      ${stats}
      ${secao('Atributos', atrib + tracos)}
      ${secao('Armas &amp; equipamento', blocoEquipamento(S, R))}
      ${secao('Habilidades', listaChips(habs))}
      ${secao('Secundárias', listaChips(secs))}
      ${secao('Proezas', proezas)}
      ${secao('Artes', artes)}
      ${secao('Efeitos Especiais', efeitos)}
    </div>
  </article>`;
}

/** Abre o card no modal que o `FichaResumo.astro` deixou na página. */
export async function abrirFichaResumo(S: any, opts: Parameters<typeof cardFichaHTML>[1] = {}) {
  await carregarNomes().catch(() => null);   // sem o dicionário, o card usa os ids
  const modal = document.getElementById('fr-modal');
  const corpo = document.getElementById('fr-body');
  if (!modal || !corpo) return;
  corpo.innerHTML = cardFichaHTML(S, opts);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  (modal.querySelector('.fr-x') as HTMLElement)?.focus();
}
