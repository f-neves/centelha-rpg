// Motor da ficha interativa (extraído de ficha.astro para ser reaproveitado).
// Renderiza bolinhas/cards/derivados no esqueleto (FichaSkeleton.astro) e calcula XP ao vivo.
// A persistência e o orçamento são configuráveis via opts, para servir tanto a /ficha
// (localStorage) quanto a /personagem (Supabase, com XP definido pelo mestre).
import { custoPontos, custoTecnica, custoArte, pv, defesa, defesaMental, defesaSocial, energia, mana, folego, iniciativa, deslocamento, ataqueCentelha, aparenciaMod, empilharArmaduras, soakNatural, MODO_NOME, MODO_ORDEM, SOAK_CATS, regras } from './calc';
import ATTRS_D from '../data/atributos.json';
import HAB_D from '../data/habilidades.json';
import VIRT_D from '../data/virtudes.json';
import CAM_D from '../data/caminhos.json';
import TEC_D from '../data/tecnicas.json';
import ARTE_D from '../data/artes.json';
import ARMA_D from '../data/armas.json';
import ARMADURA_D from '../data/armaduras.json';
import ESCUDO_D from '../data/escudos.json';

export interface FichaOpts {
  /** Carrega o estado inicial (objeto S) ou null para começar do zero. Pode ser assíncrono. */
  carregar: () => any | null | Promise<any | null>;
  /** Persiste o estado (chamado a cada alteração; faça debounce no adapter se preciso). */
  salvar: (estado: any) => void;
  /** Trava o input de orçamento (ex.: XP definido pelo mestre). */
  budgetLocked?: boolean;
  /** Força este orçamento sobre o estado carregado (XP do mestre). null/undefined = usa o do estado. */
  budgetValor?: number | null;
  /** Limpeza extra ao resetar (ex.: localStorage/hash). */
  aoResetar?: () => void;
  /** Modo leitura: renderiza tudo, mas bloqueia edição (ex.: visão do mestre). */
  readOnly?: boolean;
}

export function montarFicha(opts: FichaOpts) {
  const ARMA: Record<string, any> = Object.fromEntries((ARMA_D as any[]).map((w) => [w.id, w]));
  const ARMADURA: Record<string, any> = Object.fromEntries((ARMADURA_D as any[]).map((a) => [a.id, a]));
  const ESCUDO: Record<string, any> = Object.fromEntries((ESCUDO_D as any[]).map((s) => [s.id, s]));
  const el = (id: string) => document.getElementById(id)!;
  const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const ATTR_GRP: Record<string, string> = { fisico: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const HAB_GRP: Record<string, string> = { combate: 'Combate', fisica: 'Físicas', social: 'Sociais', saber: 'Saber', tecnica: 'Técnicas' };
  const SECONDARY: [string, string][] = [
    ['Halterofilismo', 'Corpo'], ['Natação', 'Corpo'], ['Ginástica', 'Corpo'], ['Equilíbrio', 'Corpo'], ['Malabarismo', 'Corpo'], ['Escalada', 'Corpo'],
    ['Etiqueta', 'Sociais'], ['Negociação', 'Sociais'], ['Lábia', 'Sociais'], ['Intimidação', 'Sociais'], ['Atuação', 'Sociais'], ['Sedução', 'Sociais'], ['Disfarce', 'Sociais'], ['Interrogatório', 'Sociais'],
    ['Ciências', 'Conhecimento'], ['Comércio', 'Conhecimento'], ['Herbologia', 'Conhecimento'], ['História', 'Conhecimento'], ['Religião', 'Conhecimento'], ['Heráldica', 'Conhecimento'], ['Astronomia', 'Conhecimento'], ['Geografia', 'Conhecimento'], ['Alquimia', 'Conhecimento'], ['Arquitetura', 'Conhecimento'], ['Direito', 'Conhecimento'], ['Bestiário', 'Conhecimento'], ['Estratégia', 'Conhecimento'], ['Genealogia', 'Conhecimento'], ['Folclore', 'Conhecimento'],
    ['Cavalgar', 'Ofício'], ['Ferraria', 'Ofício'], ['Carpintaria', 'Ofício'], ['Costura', 'Ofício'], ['Culinária', 'Ofício'], ['Joalheria', 'Ofício'], ['Couraria', 'Ofício'], ['Alvenaria', 'Ofício'], ['Mineração', 'Ofício'], ['Pesca', 'Ofício'], ['Agricultura', 'Ofício'], ['Navegação', 'Ofício'], ['Marcenaria', 'Ofício'], ['Armadureiro', 'Ofício'], ['Armeiro', 'Ofício'], ['Escrivania', 'Ofício'], ['Cartografia', 'Ofício'], ['Veterinário', 'Ofício'], ['Adestramento', 'Ofício'],
    ['Performance', 'Expressão'], ['Tocar Instrumento', 'Expressão'], ['Canto', 'Expressão'], ['Dança', 'Expressão'], ['Poesia', 'Expressão'], ['Pintura', 'Expressão'], ['Escultura', 'Expressão'], ['Caligrafia', 'Expressão'], ['Contação de Histórias', 'Expressão'],
    ['Ladinagem', 'Subterfúgio'], ['Jogos', 'Subterfúgio'], ['Falsificação', 'Subterfúgio'], ['Abrir Fechaduras', 'Subterfúgio'], ['Contrabando', 'Subterfúgio'], ['Apostar', 'Subterfúgio'], ['Roubo', 'Subterfúgio'], ['Ocultação', 'Subterfúgio'], ['Vigilância Urbana', 'Subterfúgio'],
    ['Meditação', 'Interior'], ['Ritualismo', 'Interior'], ['Autocontrole', 'Interior'], ['Concentração', 'Interior'], ['Leitura Corporal', 'Interior'], ['Interpretação de Sonhos', 'Interior'],
  ];

  const SEC_NOME: Record<string, string> = Object.fromEntries(SECONDARY.map(([n]) => [slug(n), n]));
  const TRACO_DESC: Record<string, string> = {
    centelha: 'O nível de poder pessoal, do mortal ao semideus. Destrava os níveis das Proezas e dimensiona Energia e Mana.',
    willpower: 'Reserva de determinação (piso 1). Gasta-se para potencializar ações, resistir a medo e manipulação, e conjurar.',
    aparencia: 'Traço próprio (1–12, piso 1, ×2). Modificador direcional na jogada social: ajuda alinhado (seduzir/impressionar), atrapalha invertido (intimidar). A Compostura mascara parte dele.',
  };
  function openTraitModal(nm: HTMLElement) {
    const dots = nm.closest('.trow')?.querySelector('.dots') as HTMLElement | null; if (!dots) return;
    const k = dots.dataset.kind!, key = dots.dataset.key!;
    let p: any = null;
    if (k === 'attr') { const a = (ATTRS_D as any[]).find((x) => x.id === key); p = { tipo: 'atributo', nome: a.nome, descricao: a.descricao, niveis: a.niveis }; }
    else if (k === 'skill') { const h = (HAB_D as any[]).find((x) => x.id === key); p = { tipo: 'habilidade', nome: h.nome, descricao: h.descricao, niveis: (regras as any).escalaHabilidade }; }
    else if (k === 'skill2') { p = { tipo: 'habilidade secundária', nome: SEC_NOME[key] || key, descricao: 'Conhecimento ou ofício específico (custo reduzido). Segue a mesma escala de competência.', niveis: (regras as any).escalaHabilidade }; }
    else if (k === 'virtue') { const v = (VIRT_D as any[]).find((x) => x.id === key); p = { tipo: 'virtude', nome: v.nome, descricao: `${v.descricao} Resiste a ${v.resiste}.`, niveis: v.niveis }; }
    else if (k === 'centelha') { p = { tipo: 'traço', nome: 'Centelha', descricao: TRACO_DESC.centelha, niveis: (regras as any).escalaCentelha }; }
    else if (k === 'willpower') { p = { tipo: 'traço', nome: 'Força de Vontade', descricao: TRACO_DESC.willpower, niveis: (regras as any).escalaVontade }; }
    else if (k === 'aparencia') { p = { tipo: 'traço', nome: 'Aparência', descricao: TRACO_DESC.aparencia, niveis: (regras as any).escalaAparencia }; }
    if (p && (window as any).refModal) (window as any).refModal(p);
  }
  const CAM_ORDER = (CAM_D as any[]).map((c) => c.id);
  const CAM_NOME: Record<string, string> = Object.fromEntries((CAM_D as any[]).map((c) => [c.id, c.nome]));
  const CAMTREE: Record<string, [string, string, number][]> = {};
  for (const t of TEC_D as any[]) (CAMTREE[t.caminho] ??= []).push([t.id, t.nome, t.nivel]);
  for (const k in CAMTREE) CAMTREE[k].sort((a, b) => a[2] - b[2]);
  const TECNIV: Record<string, number> = Object.fromEntries((TEC_D as any[]).map((t) => [t.id, t.nivel]));
  const TECPRE: Record<string, string[]> = Object.fromEntries((TEC_D as any[]).map((t) => [t.id, t.prereq || []]));
  const TECNOME: Record<string, string> = Object.fromEntries((TEC_D as any[]).map((t) => [t.id, t.nome]));
  const TECTEXT: Record<string, string> = Object.fromEntries((TEC_D as any[]).map((t) => [t.id, t.texto || '']));
  const mdBold = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const col3 = <T,>(items: T[], render: (x: T) => string) => {
    const n = Math.ceil(items.length / 3);
    return [items.slice(0, n), items.slice(n, 2 * n), items.slice(2 * n)]
      .map((c) => '<div>' + c.map(render).join('') + '</div>').join('');
  };
  const CREA = (regras as any).limitesCriacao as { atributo: number; habilidade: number; centelha: number; picoAtributo?: number; picoHabilidade?: number };
  const centReq = (b: number) => b;
  function capFor(kind: string, key?: string): number {
    if (kind === 'arte2') return (S.centelha || 0) > 0 ? (S.skills?.ocultismo || 0) : 0;
    const full: Record<string, number> = { attr: 6, skill: 6, skill2: 6, virtue: 6, centelha: 6, willpower: 12, aparencia: 12 };
    if (S.modo === 'evolucao') return full[kind] ?? 6;
    if (kind === 'attr' || kind === 'skill') {
      const base = kind === 'attr' ? CREA.atributo : CREA.habilidade;
      const pico = (kind === 'attr' ? CREA.picoAtributo : CREA.picoHabilidade) ?? base;
      if (pico <= base) return base;
      const store: Record<string, number> = kind === 'attr' ? S.attrs : S.skills;
      let outroPico = false;
      for (const k in store) { if (k !== key && (store[k] || 0) > base) { outroPico = true; break; } }
      return outroPico ? base : pico;
    }
    const crea: Record<string, number> = { skill2: CREA.habilidade, virtue: 6, centelha: CREA.centelha, willpower: 12, aparencia: 12 };
    return crea[kind] ?? 6;
  }

  // ---- estado ----
  let S: any;
  const OPEN = { cam: {} as Record<string, boolean>, arte: {} as Record<string, boolean> };
  function fresh() {
    S = { id: {}, attrs: {}, skills: {}, spec: {}, skills2: {}, spec2: {}, virtues: {}, willpower: 1, aparencia: 1, centelha: 0, tech: {}, arte: {}, budget: 1400, modo: 'criacao', equip: { arma: 'desarmado', armaduras: [], escudo: 'nenhum' }, defSpec: { esquiva: [], bloqueio: [], social: [], mental: [] } };
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] = 1));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] = 0; S.spec[h.id] = 0; });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] = 1));
    SECONDARY.forEach(([n]) => { S.skills2[slug(n)] = 0; S.spec2[slug(n)] = 0; });
  }
  function normalize() {
    S.id ??= {}; S.attrs ??= {}; S.skills ??= {}; S.spec ??= {}; S.skills2 ??= {}; S.spec2 ??= {}; S.virtues ??= {}; S.tech ??= {}; S.arte ??= {};
    S.defSpec ??= {}; for (const k of ['esquiva', 'bloqueio', 'social', 'mental']) S.defSpec[k] ??= [];
    S.willpower ??= 1; S.aparencia ??= 1; S.centelha ??= 0; S.budget ??= 1400; S.modo ??= 'criacao'; S.derivCol ??= true;
    S.equip ??= {}; S.equip.arma ??= 'desarmado'; S.equip.escudo ??= 'nenhum';
    if (!Array.isArray(S.equip.armaduras)) S.equip.armaduras = (S.equip.armadura && S.equip.armadura !== 'nenhuma') ? [S.equip.armadura] : [];
    delete S.equip.armadura;
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] ??= 1));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] ??= 0; S.spec[h.id] ??= 0; });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] ??= 1));
    SECONDARY.forEach(([n]) => { const k = slug(n); S.skills2[k] ??= 0; S.spec2[k] ??= 0; });
  }
  const save = () => { if (opts.readOnly) return; try { opts.salvar(S); } catch {} };

  // ---- builders ----
  const dotsHTML = (kind: string, key: string, value: number, max: number, floor: number) => {
    const cap = capFor(kind, key);
    let h = `<span class="dots" data-kind="${kind}" data-key="${key}" tabindex="0" role="slider" aria-valuemin="${floor}" aria-valuemax="${cap}" aria-valuenow="${value}" aria-label="${key.replace(/-/g, ' ')} (use as setas)">`;
    for (let d = 1; d <= max; d++) {
      const capped = d > cap;
      const tip = capped ? ' title="Limite de criação — ative \'Evolução\' na barra de XP para passar daqui"' : '';
      h += `<span class="dot${d <= value ? ' on' : ''}${d <= floor ? ' free' : ''}${capped ? ' cap' : ''}" data-d="${d}"${tip}></span>`;
    }
    return h + '</span>';
  };
  const specHTML = (key: string, value: number, maxAllowed: number) => {
    let h = `<span class="spec" data-spec="${key}">`;
    for (let d = 1; d <= 6; d++) h += `<span class="sq${d <= value ? ' on' : ''}${d > maxAllowed ? ' dis' : ''}" data-d="${d}"></span>`;
    return h + '</span>';
  };
  const trow = (nm: string, right: string) => `<div class="trow"><span class="nm">${nm}</span><span class="tr-r">${right}</span></div>`;
  const rollBtn = (k: string, key: string) => `<button class="rollv" data-roll="${k}:${key}" title="Enviar ao rolador" aria-label="Rolar">🎲</button>`;

  // ---- render ----
  function renderAttrs() {
    const groups: Record<string, any[]> = { Físicos: [], Sociais: [], Mentais: [] };
    (ATTRS_D as any[]).forEach((a) => groups[ATTR_GRP[a.grupo]].push(a));
    el('attrs').innerHTML = ['Físicos', 'Sociais', 'Mentais'].map((g) =>
      `<div><h3>${g}</h3>${groups[g].map((a) => trow(a.nome, dotsHTML('attr', a.id, S.attrs[a.id], 6, 1) + rollBtn('attr', a.id))).join('')}</div>`).join('');
  }
  function renderPower() {
    let h = trow('<b>Centelha</b> <small>(0–6)</small>', dotsHTML('centelha', 'centelha', S.centelha, 6, 0));
    h += '<h3>Virtudes</h3>';
    (VIRT_D as any[]).forEach((v) => (h += trow(v.nome, dotsHTML('virtue', v.id, S.virtues[v.id], 6, 1))));
    h += '<h3>Força de Vontade <small>(piso 1 · ×2)</small></h3>';
    h += trow('Vontade', dotsHTML('willpower', 'willpower', S.willpower, 12, 1));
    h += '<h3>Aparência <small>(1–12 · piso 1 · ×2)</small></h3>';
    const am = aparenciaMod(S.aparencia);
    h += trow(`Aparência <span class="apmod" title="Bônus/Penalidade na jogada social alinhada">${am >= 0 ? '+' : ''}${am}</span>`, dotsHTML('aparencia', 'aparencia', S.aparencia, 12, 1));
    el('power').innerHTML = h;
  }
  function renderSkills() {
    const groups: Record<string, any[]> = { Combate: [], Físicas: [], Sociais: [], Saber: [], Técnicas: [] };
    (HAB_D as any[]).filter((s) => !s.secundaria).forEach((s) => groups[HAB_GRP[s.grupo]].push(s));
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })));
    const cols = [['Combate', 'Físicas'], ['Sociais'], ['Saber']];
    el('skills').innerHTML = cols.map((col) => '<div>' + col.map((g) =>
      (groups[g] || []).length ? `<h3>${g}</h3>` + groups[g].map((s) => trow(s.nome, dotsHTML('skill', s.id, S.skills[s.id], 6, 0) + specHTML(s.id, S.spec[s.id] || 0, S.skills[s.id] || 0) + rollBtn('skill', s.id))).join('') : '').join('') + '</div>').join('');
  }
  function renderSecondary() {
    const groups: Record<string, string[]> = {}; SECONDARY.forEach(([n, g]) => (groups[g] ??= []).push(n));
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' })));
    const cols = [['Corpo', 'Sociais', 'Conhecimento'], ['Ofício'], ['Expressão', 'Subterfúgio', 'Interior']];
    el('secondary').innerHTML = cols.map((col) => '<div>' + col.map((g) =>
      `<h3>${g}</h3>` + (groups[g] || []).map((n) => { const k = slug(n); return trow(n, dotsHTML('skill2', k, S.skills2[k] || 0, 6, 0) + specHTML('2_' + k, S.spec2[k] || 0, S.skills2[k] || 0)); }).join('')).join('') + '</div>').join('');
  }
  function renderCaminhos() {
    const card = (cam: string) => {
      const techs = CAMTREE[cam] || [];
      const sel = techs.filter(([id]) => S.tech[id]);
      const cost = sel.reduce((s, [, , b]) => s + b * 10, 0);
      const open = OPEN.cam[cam];
      const rows = techs.map(([id, nome, b]) => {
        const owned = !!S.tech[id];
        const centOk = (S.centelha || 0) >= centReq(b);
        const miss = (TECPRE[id] || []).filter((p) => !S.tech[p]);
        const ok = centOk && miss.length === 0;
        const cls = 'tpill' + (owned ? ' on' : '') + (!owned && !ok ? ' locked' : '') + (owned && !ok ? ' invalid' : '');
        const reasons: string[] = []; if (!centOk) reasons.push('Centelha ' + centReq(b)); if (miss.length) reasons.push('pré: ' + miss.map((p) => TECNOME[p]).join(', '));
        const title = reasons.length ? ` title="Requer ${reasons.join(' · ').replace(/"/g, '')}"` : '';
        const desc = TECTEXT[id] ? `<div class="tdesc">${mdBold(TECTEXT[id])}</div>` : '';
        return `<div class="techrow"><span class="${cls}" data-tech="${id}"${title}>${!owned && !ok ? '🔒 ' : ''}${nome} <small>N${b} · ${b * 10}</small></span>${desc}</div>`;
      }).join('');
      return `<div class="cam"><div class="cam-head" data-camtog="${cam}"><span class="chev">${open ? '▾' : '▸'}</span><span class="cam-nm">Proeza ${CAM_NOME[cam]}</span><span class="cam-meta">${sel.length ? `${sel.length} téc · ${cost} XP` : '—'}</span></div><div class="cam-body" style="display:${open ? 'block' : 'none'}">${rows}</div></div>`;
    };
    el('tecnicas').innerHTML = col3(CAM_ORDER, card);
  }
  function renderArtes() {
    const card = (a: any) => {
      const lvl = S.arte[a.id] || 0, cost = custoArte(lvl), open = OPEN.arte[a.id];
      const fx = a.niveis.map((n: any) => `<div class="fxline${n.nivel <= lvl ? ' hi' : ''}">${n.nivel} — <b>${n.nome}</b>: ${n.efeito}</div>`).join('');
      return `<div class="cam"><div class="cam-head"><span class="chev" data-artetog="${a.id}">${open ? '▾' : '▸'} ${a.nome}</span>${dotsHTML('arte2', a.id, lvl, 5, 0)}<span class="cam-meta">${lvl ? `nível ${lvl} · ${cost} XP` : '—'}</span></div><div class="cam-body" style="display:${open ? 'block' : 'none'}">${fx}</div></div>`;
    };
    el('artes').innerHTML = col3(ARTE_D as any[], card);
  }
  const A = (id: string) => S.attrs[id] || 0, SK = (id: string) => S.skills[id] || 0, VI = (id: string) => S.virtues[id] || 0;
  function renderDerived() {
    const virt = { compaixao: VI('compaixao'), conviccao: VI('conviccao'), temperanca: VI('temperanca'), valor: VI('valor') };
    const C = S.centelha, W = S.willpower, integ = SK('integridade');
    const r = (l: string, v: any, fm: string, extra = false) => `<div class="derv${extra ? ' derv-extra' : ''}"><span class="dl">${l}<span class="fm">${fm}</span></span><span class="dv">${v}</span></div>`;
    const pecas = (S.equip?.armaduras || []).map((id: string) => ARMADURA[id]).filter(Boolean);
    const armSt = empilharArmaduras(pecas);
    const escD = ESCUDO[S.equip?.escudo || 'nenhum'] || { penalidade: 0 };
    const penFisica = (armSt.penalidade || 0) + (escD.penalidade || 0);
    const cs = (regras.dano as any)?.centelhaNoSoak ?? 0;
    const vig = A('vigor');
    const defEsq = defesa({ destreza: A('destreza'), habilidade: SK('esquiva'), centelha: C }) - penFisica;
    // Bloqueio: o JOGADOR escolhe a perícia de aparar (Armas 1M/2M, Briga, Escudos); o modificador da arma/escudo entra na aba de Combate.
    const blkSkills = ['armas-uma-mao', 'armas-duas-maos', 'briga', 'escudos'];
    const blkNome: Record<string, string> = { 'armas-uma-mao': 'Armas 1 Mão', 'armas-duas-maos': 'Armas 2 Mãos', briga: 'Briga', escudos: 'Escudos' };
    if (!blkSkills.includes(S.blkPericia)) S.blkPericia = blkSkills.reduce((b, s) => (SK(s) > SK(b) ? s : b), blkSkills[0]);
    const defBlq = defesa({ destreza: A('destreza'), habilidade: SK(S.blkPericia), centelha: C }) - penFisica;
    const blkSel = opts.readOnly
      ? `${defBlq} <span class="muted">(${blkNome[S.blkPericia]})</span>`
      : `${defBlq} <select data-blkpericia style="font-family:inherit;font-size:.72rem;margin-left:.35rem">${blkSkills.map((s) => `<option value="${s}"${s === S.blkPericia ? ' selected' : ''}>${blkNome[s]} (${SK(s)})</option>`).join('')}</select>`;
    const soakStr = SOAK_CATS.map((cat) => soakNatural(vig, cat) + C * cs + (armSt.soak[cat] || 0)).join(' / ');
    // Especialidades situacionais de defesa (S.defSpec) ficam DORMENTES por ora: sem editor na ficha.
    el('derived').innerHTML =
      r('Pontos de Vida', pv(A('vigor')), '25 + Vigor×3') +
      r('Defesa (Esquiva)', defEsq, '(Des + Esquiva)×2 + Centelha − penalidade') +
      r('Defesa (Bloqueio)', blkSel, '(Des + perícia de aparar)×2 + Centelha − penalidade') +
      r('Defesa Social', defesaSocial({ compostura: A('compostura'), sociabilidade: SK('sociabilidade'), centelha: C }), '(Compostura + Sociabilidade)×2 + Centelha') +
      r('Defesa Mental', defesaMental({ raciocinio: A('raciocinio'), integridade: integ, vontade: W, centelha: C }), 'Raciocínio + Integridade + Vontade + Centelha') +
      r('Absorção Imp/Cor/Perf', `${soakStr}${armSt.resistPerf ? ` · Nível ${armSt.resistPerf}` : ''}`, 'Vigor + Centelha no Impacto; só Centelha em Corte/Perf; + armadura') +
      r('Energia', energia({ centelha: C, virtudes: virt, vontade: W }), 'Centelha×3 + Virtudes + Vontade', true) +
      r('Mana', mana({ centelha: C, vontade: W }), 'Centelha×2 + Vontade', true) +
      r('Fôlego', folego({ vigor: A('vigor'), resistencia: SK('resistencia'), vontade: W }), '10 + Vigor×5 + Resistência×4 + Vontade×2 · recupera Vigor/Tick', true) +
      r('Iniciativa', iniciativa({ raciocinio: A('raciocinio'), prontidao: SK('prontidao') }).str, '+ Raciocínio + Prontidão', true) +
      (() => { const dz = deslocamento({ forca: A('forca'), destreza: A('destreza'), atletismo: SK('atletismo'), centelha: C });
        const penMov = Math.floor(penFisica / 2);
        const mp = (v: number) => Math.max(0, v - penMov);
        const cmp = (v: number) => Math.max(0, v - penMov * 10);
        const ps = penMov ? ` − ½ penalidade (${penMov})` : '';
        const psv = penMov ? ` − ½ penalidade×10` : '';
        return r('Deslocamento livre', `${mp(dz.normal)} m`, `(Des + Atletismo) ÷ 2 · distância na ação${ps}`, true) +
          r('Vel. de Arranque', `${mp(dz.arranque)} m/s`, `(Força + Atletismo) ÷ 2 + Destreza · Ticks 1–3${ps}`, true) +
          r('Vel. de Corrida', `${mp(dz.corrida)} m/s`, `Destreza × 1,5 + Atletismo · Tick 4+${ps}`, true) +
          r('Salto Vertical', `${cmp(dz.saltoVertical)} cm`, `Força×20 + Atletismo×10 + Des×4 + Centelha×50${psv}`, true) +
          r('Salto Horiz. Parado', `${mp(dz.saltoHorizontalParado)} m`, `(Força + Atletismo + Centelha) ÷ 2${ps}`, true) +
          r('Salto Horiz. Correndo', `${mp(dz.saltoHorizontalCorrendo)} m`, `Vel. de Corrida + Atletismo ÷ 2 + Centelha${ps}`, true); })();
  }
  function applyDerivCol() {
    el('derived').classList.toggle('collapsed', !!S.derivCol);
    el('deriv-toggle').textContent = S.derivCol ? 'Expandir' : 'Contrair';
  }
  function renderCombate() {
    const w = ARMA[S.equip?.arma || 'desarmado'] || ARMA['desarmado'];
    const esc = ESCUDO[S.equip?.escudo || 'nenhum'] || { bloqCaC: 0, bloqProjetil: 0, penalidade: 0 };
    const C = S.centelha || 0, forca = S.attrs.forca || 0;
    const pecas = (S.equip?.armaduras || []).map((id: string) => ARMADURA[id]).filter(Boolean);
    const armorPen = empilharArmaduras(pecas).penalidade || 0;
    const sgn = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
    const soma = (S.attrs[w.atrib] || 0) + (S.skills[w.pericia] || S.skills2[w.pericia] || 0);
    const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const flat = (w.acerto || 0) + ataqueCentelha(C) - armorPen;
    const pool = `${dados}d6${bonus ? '+2' : ''}${flat ? ` ${sgn(flat)}` : ''}`;
    const dist = w.tags.includes('distância');
    const fm = regras.derivados.danoForca; const forcaAp = dist ? 0 : forca * ((w as any).forcaMult ?? (w.maos === 2 ? fm.duasMaos : fm.umaMao));
    const danoBase = `${w.dado}d6${forcaAp ? ` +${forcaAp}` : ''}`;
    const modos = ((w.modos ?? [{ tipo: w.tipoDano, perf: w.pen, principal: true }]) as any[]).slice().sort((a, b) => ((MODO_ORDEM as any)[a.tipo] ?? 9) - ((MODO_ORDEM as any)[b.tipo] ?? 9));
    const modoStr = modos.map((m) => `${MODO_NOME[m.tipo as keyof typeof MODO_NOME]}${m.perf != null ? ` (N${m.perf})` : ''}${m.principal ? '' : ' *'}`).join(' · ');
    const temSec = modos.some((m) => !m.principal);
    const blk = defesa({ destreza: S.attrs.destreza || 0, habilidade: S.skills[w.pericia] || S.skills2[w.pericia] || 0, centelha: C }) + (w.defesaArma || 0) + (esc.bloqCaC || 0) - armorPen;
    const blkDS = ((S.defSpec?.bloqueio || []) as any[]).map((e: any) => `${e.v >= 0 ? '+' : ''}${e.v} ${e.s}`);
    el('combate').innerHTML =
      `<div class="cmb"><b>Ataque</b> — ${w.nome}: rola <b>${pool}</b> · dano base <b>${danoBase}</b> · Speed ${w.ticks} · Fôlego ${w.folego ?? 0}</div>` +
      `<div class="cmb"><b>Modos</b> — ${modoStr}${temSec ? ' <span class="muted">(* secundário: −2 acerto e −2 dano)</span>' : ''}</div>` +
      `<div class="cmb muted">Custa ${w.folego ?? 0} de Fôlego por golpe; recupera Vigor/Tick fora dos ataques. Esforço: cada +1d6 dobra o Fôlego (${(w.folego ?? 0) * 2} → ${(w.folego ?? 0) * 4}…) e +1 Speed.</div>` +
      (dist ? '' : `<div class="cmb"><b>Defesa por Bloqueio</b> — <b>${blk}</b> <span class="muted">(${w.pericia === 'escudos' ? 'Escudos' : w.nome} + Def. Arma ${w.defesaArma >= 0 ? '+' : ''}${w.defesaArma}${esc.bloqCaC ? ` + escudo ${esc.bloqCaC}` : ''}${armorPen ? ` − armadura ${armorPen}` : ''})</span></div>`) +
      (!dist && blkDS.length ? `<div class="cmb muted">Especialidades situacionais de bloqueio: ${blkDS.join(' · ')}.</div>` : '') +
      (esc.bloqProjetil ? `<div class="cmb muted">Escudo vs projétil: +${esc.bloqProjetil} à Defesa contra ataques à distância${esc.penalidade ? ` · −${esc.penalidade} nas outras ações físicas (não no próprio bloqueio)` : ''}.</div>` : '') +
      (w.notas ? `<div class="cmb muted">${w.notas}</div>` : '') +
      (pecas.length ? `<div class="cmb muted">Armadura: ${pecas.map((p: any) => p.nome).join(' + ')}.</div>` : '');
  }
  function populateEquip() {
    const fill = (id: string, list: any[], sel: string) => { const s = el(id) as HTMLSelectElement; s.innerHTML = list.map((o) => `<option value="${o.id}">${o.nome}</option>`).join(''); s.value = sel; };
    fill('eq-arma', ARMA_D as any[], S.equip.arma); fill('eq-escudo', ESCUDO_D as any[], S.equip.escudo);
    const box = el('eq-armaduras');
    box.innerHTML = (ARMADURA_D as any[]).filter((a) => a.id !== 'nenhuma')
      .map((a) => `<label class="arm-chk"><input type="checkbox" data-arm="${a.id}"${(S.equip.armaduras || []).includes(a.id) ? ' checked' : ''}${opts.readOnly ? ' disabled' : ''}/> ${a.nome}</label>`).join('');
    if (opts.readOnly) { (el('eq-arma') as HTMLSelectElement).disabled = true; (el('eq-escudo') as HTMLSelectElement).disabled = true; }
    box.querySelectorAll('input[data-arm]').forEach((cb) => cb.addEventListener('change', (e) => {
      const t = e.target as HTMLInputElement; const set = new Set<string>(S.equip.armaduras || []);
      if (t.checked) set.add(t.dataset.arm!); else set.delete(t.dataset.arm!);
      S.equip.armaduras = [...set]; renderDerived(); renderCombate(); save();
    }));
  }
  function recompute() {
    let xa = 0, xs = 0, xsp = 0, xv = 0, xw = 0, xap = 0, xc = 0, x2 = 0, xt = 0, xar = 0;
    (ATTRS_D as any[]).forEach((a) => (xa += custoPontos('atributo', 1, S.attrs[a.id] || 1)));
    (HAB_D as any[]).filter((h) => !h.secundaria).forEach((h) => { xs += custoPontos('habilidadePrimaria', 0, S.skills[h.id] || 0); xsp += (S.spec[h.id] || 0) * 10; });
    ['esquiva', 'bloqueio', 'social', 'mental'].forEach((k) => ((S.defSpec?.[k] || []) as any[]).forEach((e) => (xsp += (e.v || 0) * 10)));
    (VIRT_D as any[]).forEach((v) => (xv += custoPontos('virtude', 1, S.virtues[v.id] || 1)));
    xw = custoPontos('vontade', 1, S.willpower || 1);
    xap = custoPontos('aparencia', 1, S.aparencia || 1);
    xc = custoPontos('centelha', 0, S.centelha || 0);
    SECONDARY.forEach(([n]) => { const k = slug(n); x2 += custoPontos('habilidadeSecundaria', 0, S.skills2[k] || 0) + (S.spec2[k] || 0) * 5; });
    Object.keys(S.tech).forEach((id) => { if (S.tech[id] && TECNIV[id]) xt += TECNIV[id] * 10; });
    (ARTE_D as any[]).forEach((a) => (xar += custoArte(S.arte[a.id] || 0)));
    const total = xa + xs + xsp + xv + xw + xap + xc + x2 + xt + xar;
    el('xpSpent').textContent = String(total);
    const rem = (S.budget || 0) - total, re = el('xpRem'); re.textContent = String(rem); re.className = 'rem ' + (rem < 0 ? 'neg' : 'ok');
    el('xpBreak').innerHTML = `Atrib ${xa} · Habilidades ${xs + xsp} · Virtudes ${xv} · Vontade ${xw} · Aparência ${xap} · Centelha ${xc}` + (x2 ? ` · Secund. ${x2}` : '') + (xt ? ` · Técnicas ${xt}` : '') + (xar ? ` · Artes ${xar}` : '');
    renderDerived(); renderCombate(); save();
  }

  // ---- interações ----
  const floorOf: Record<string, number> = { attr: 1, skill: 0, skill2: 0, virtue: 1, centelha: 0, willpower: 1, aparencia: 1, arte2: 0 };
  const valOf = (k: string, key: string) => ({ attr: S.attrs[key], skill: S.skills[key], skill2: S.skills2[key] || 0, virtue: S.virtues[key], centelha: S.centelha, willpower: S.willpower, aparencia: S.aparencia, arte2: S.arte[key] || 0 } as any)[k] || 0;
  function refreshDots(kind: string, key: string) {
    const span = document.querySelector(`.dots[data-kind="${kind}"][data-key="${key}"]`); if (!span) return;
    const floor = floorOf[kind], val = valOf(kind, key);
    span.setAttribute('aria-valuenow', String(val));
    span.querySelectorAll('.dot').forEach((d) => { const dd = +(d as HTMLElement).dataset.d!; d.classList.toggle('on', dd <= val); d.classList.toggle('free', dd <= floor); });
  }
  function refreshCaps(kind: string) {
    document.querySelectorAll(`.dots[data-kind="${kind}"]`).forEach((span) => {
      const key = (span as HTMLElement).dataset.key!;
      const cap = capFor(kind, key);
      span.setAttribute('aria-valuemax', String(cap));
      span.querySelectorAll('.dot').forEach((d) => { const dd = +(d as HTMLElement).dataset.d!; d.classList.toggle('cap', dd > cap); });
    });
  }
  function applyVal(kind: string, key: string, nv: number) {
    const floor = floorOf[kind]; nv = Math.max(floor, Math.min(nv, capFor(kind, key)));
    if (kind === 'attr') S.attrs[key] = nv;
    else if (kind === 'skill') { S.skills[key] = nv; if ((S.spec[key] || 0) > nv) S.spec[key] = nv; renderSkills(); if (key === 'ocultismo') renderArtes(); }
    else if (kind === 'skill2') { S.skills2[key] = nv; if ((S.spec2[key] || 0) > nv) S.spec2[key] = nv; renderSecondary(); }
    else if (kind === 'virtue') S.virtues[key] = nv;
    else if (kind === 'centelha') { S.centelha = nv; renderCaminhos(); renderArtes(); }
    else if (kind === 'willpower') S.willpower = nv;
    else if (kind === 'aparencia') S.aparencia = nv;
    else if (kind === 'arte2') { S.arte[key] = nv; renderArtes(); }
    if (['attr', 'virtue', 'centelha', 'willpower', 'aparencia'].includes(kind)) refreshDots(kind, key);
    if (kind === 'aparencia') { const m = aparenciaMod(nv); const sp = document.querySelector('.apmod'); if (sp) sp.textContent = (m >= 0 ? '+' : '') + m; }
    if (kind === 'attr' && S.modo === 'criacao') refreshCaps('attr');
    recompute();
  }
  function setDot(kind: string, key: string, d: number) {
    const floor = floorOf[kind], val = valOf(kind, key);
    applyVal(kind, key, d <= floor ? floor : val === d ? d - 1 : d);
  }
  function bump(kind: string, key: string, delta: number) {
    applyVal(kind, key, valOf(kind, key) + delta);
    (document.querySelector(`.dots[data-kind="${kind}"][data-key="${key}"]`) as HTMLElement)?.focus();
  }
  function setSpec(specKey: string, d: number) {
    if (specKey.startsWith('2_')) { const sl = specKey.slice(2); let nv = (S.spec2[sl] || 0) === d ? d - 1 : d; nv = Math.max(0, Math.min(nv, S.skills2[sl] || 0)); S.spec2[sl] = nv; renderSecondary(); }
    else { let nv = (S.spec[specKey] || 0) === d ? d - 1 : d; nv = Math.max(0, Math.min(nv, S.skills[specKey] || 0)); S.spec[specKey] = nv; renderSkills(); }
    recompute();
  }

  document.addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('select[data-blkpericia]');
    if (sel) { S.blkPericia = sel.value; recompute(); }
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const nm = t.closest<HTMLElement>('.trow .nm');
    if (nm) { openTraitModal(nm); return; }
    const dot = t.closest<HTMLElement>('.dots .dot');
    if (dot) { if (opts.readOnly || dot.classList.contains('cap')) return; const s = dot.parentElement as HTMLElement; setDot(s.dataset.kind!, s.dataset.key!, +dot.dataset.d!); return; }
    const rb = t.closest<HTMLElement>('.rollv');
    if (rb) { const [k, key] = rb.dataset.roll!.split(':'); const rd = (n: string) => document.querySelector<HTMLInputElement>(`[data-rd="${n}"]`);
      if (k === 'attr') { const a = rd('atr'); if (a) { a.value = String(S.attrs[key] || 0); a.dispatchEvent(new Event('input')); } }
      else { const hb = rd('hab'), es = rd('esp'); if (hb) hb.value = String(S.skills[key] || 0); if (es) es.value = String(S.spec[key] || 0); hb?.dispatchEvent(new Event('input')); }
      document.querySelector('.rolador')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    const sq = t.closest<HTMLElement>('.spec .sq');
    if (sq && !opts.readOnly && !sq.classList.contains('dis')) { setSpec((sq.parentElement as HTMLElement).dataset.spec!, +sq.dataset.d!); return; }
    const dsAdd = t.closest<HTMLElement>('[data-defspec-add]');
    if (dsAdd && !opts.readOnly) {
      const key = dsAdd.dataset.defspecAdd!;
      const s = (window.prompt('Situação da especialidade (ex.: contra um grupo, vs sedução, na floresta):') || '').trim();
      if (!s) return;
      const v = Math.max(0, Math.min(5, parseInt(window.prompt('Bônus quando essa situação vale (1 a 5):', '2') || '0', 10) || 0));
      if (!v) return;
      (S.defSpec[key] ||= []).push({ s, v }); recompute(); return;
    }
    const dsDel = t.closest<HTMLElement>('[data-defspec-del]');
    if (dsDel && !opts.readOnly) {
      const [key, idx] = dsDel.dataset.defspecDel!.split(':');
      (S.defSpec[key] || []).splice(+idx, 1); recompute(); return;
    }
    const pill = t.closest<HTMLElement>('.tpill');
    if (pill) { if (opts.readOnly || pill.classList.contains('locked')) return; const id = pill.dataset.tech!; S.tech[id] = !S.tech[id]; renderCaminhos(); recompute(); return; }
    const ct = t.closest<HTMLElement>('[data-camtog]');
    if (ct) { OPEN.cam[ct.dataset.camtog!] = !OPEN.cam[ct.dataset.camtog!]; renderCaminhos(); return; }
    const at = t.closest<HTMLElement>('[data-artetog]');
    if (at) { OPEN.arte[at.dataset.artetog!] = !OPEN.arte[at.dataset.artetog!]; renderArtes(); return; }
  });

  document.addEventListener('keydown', (e) => {
    if (opts.readOnly) return;
    const dots = (e.target as HTMLElement).closest?.('.dots') as HTMLElement | null; if (!dots) return;
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -1;
    else return;
    e.preventDefault(); bump(dots.dataset.kind!, dots.dataset.key!, delta);
  });

  // idrow + budget
  document.querySelectorAll<HTMLInputElement>('.idrow .txt').forEach((inp) => inp.addEventListener('input', () => { if (opts.readOnly) return; S.id[inp.dataset.id!] = inp.value; save(); }));
  (el('xpBudget') as HTMLInputElement).addEventListener('input', (e) => {
    if (opts.budgetLocked || opts.readOnly) return;
    S.budget = +(e.target as HTMLInputElement).value || 0; recompute();
  });

  function syncInputs() {
    document.querySelectorAll<HTMLInputElement>('.idrow .txt').forEach((inp) => { inp.value = S.id?.[inp.dataset.id!] || ''; inp.readOnly = !!opts.readOnly; });
    const b = el('xpBudget') as HTMLInputElement;
    b.value = String(S.budget ?? 1400);
    b.disabled = !!opts.budgetLocked || !!opts.readOnly;
    b.title = opts.budgetLocked ? 'O XP é definido pelo mestre da mesa.' : '';
  }
  function markModo() {
    document.querySelectorAll<HTMLElement>('.modo-toggle .btn').forEach((b) => { const on = b.dataset.modo === (S.modo || 'criacao'); b.classList.toggle('primary', on); b.setAttribute('aria-pressed', String(on)); });
  }
  function clampToMode() {
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] = Math.min(S.attrs[a.id] || 1, capFor('attr', a.id))));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] = Math.min(S.skills[h.id] || 0, capFor('skill', h.id)); if ((S.spec[h.id] || 0) > S.skills[h.id]) S.spec[h.id] = S.skills[h.id]; });
    SECONDARY.forEach(([n]) => { const k = slug(n); S.skills2[k] = Math.min(S.skills2[k] || 0, capFor('skill2', k)); if ((S.spec2[k] || 0) > S.skills2[k]) S.spec2[k] = S.skills2[k]; });
    S.centelha = Math.min(S.centelha || 0, capFor('centelha'));
  }
  function setModo(m: string) { S.modo = m; if (m === 'criacao') clampToMode(); renderAll(); }
  function renderAll() { syncInputs(); markModo(); renderAttrs(); renderPower(); renderSkills(); renderSecondary(); renderCaminhos(); renderArtes(); populateEquip(); recompute(); applyDerivCol(); }

  // botões
  document.querySelectorAll<HTMLElement>('.modo-toggle .btn').forEach((b) => b.addEventListener('click', () => { if (opts.readOnly) return; setModo(b.dataset.modo!); }));
  el('f-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (S.id?.nome ? slug(S.id.nome) : 'ficha') + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  el('f-import').addEventListener('click', () => { if (opts.readOnly) return; el('f-file').click(); });
  el('f-file').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { try { S = JSON.parse(String(r.result)); normalize(); if (opts.budgetValor != null) S.budget = opts.budgetValor; renderAll(); } catch { alert('Arquivo JSON inválido.'); } }; r.readAsText(f);
  });
  el('f-print').addEventListener('click', () => window.print());
  el('deriv-toggle').addEventListener('click', () => { S.derivCol = !S.derivCol; applyDerivCol(); save(); });
  let camAllOpen = false;
  el('cam-all').addEventListener('click', () => { camAllOpen = !camAllOpen; CAM_ORDER.forEach((c) => (OPEN.cam[c] = camAllOpen)); renderCaminhos(); el('cam-all').textContent = camAllOpen ? 'Recolher todos' : 'Expandir todos'; });
  (['eq-arma', 'eq-escudo'] as const).forEach((id) => el(id).addEventListener('change', (e) => { if (opts.readOnly) return; S.equip[id.slice(3)] = (e.target as HTMLSelectElement).value; renderDerived(); renderCombate(); save(); }));
  el('f-reset').addEventListener('click', () => { if (opts.readOnly) return; if (confirm('Limpar a ficha?')) { opts.aoResetar?.(); fresh(); if (opts.budgetValor != null) S.budget = opts.budgetValor; renderAll(); } });
  el('f-link').addEventListener('click', () => {
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    navigator.clipboard?.writeText(location.origin + location.pathname + '#p=' + b64);
    const b = el('f-link'); b.textContent = '✓'; setTimeout(() => (b.textContent = 'Link'), 1200);
  });

  // init
  async function init() {
    let loaded: any = null;
    try { loaded = await opts.carregar(); } catch {}
    if (loaded && typeof loaded === 'object') { S = loaded; normalize(); } else { fresh(); }
    if (opts.budgetValor != null) S.budget = opts.budgetValor;
    renderAll();
    if (opts.readOnly) {
      ['f-import', 'f-reset', 'f-file'].forEach((i) => { const e = document.getElementById(i); if (e) (e as HTMLElement).style.display = 'none'; });
      document.querySelector<HTMLElement>('.modo-toggle')?.style.setProperty('display', 'none');
      document.querySelector<HTMLElement>('.modo-lbl')?.style.setProperty('display', 'none');
      document.querySelectorAll<HTMLElement>('.rollv').forEach((e) => (e.style.display = 'none'));
    }
  }
  init();
}
