// Motor da ficha interativa (extraído de ficha.astro para ser reaproveitado).
// Renderiza bolinhas/cards/derivados no esqueleto (FichaSkeleton.astro) e calcula XP ao vivo.
// A persistência e o orçamento são configuráveis via opts, para servir tanto a /ficha
// (localStorage) quanto a /personagem (Supabase, com XP definido pelo mestre).
import { custoPontos, custoTecnica, custoArte, custoEfeito, custoEspecialidade, pisoXp, pv, defesa, defesaMental, defesaSocial, energia, mana, folego, iniciativa, deslocamento, ataqueCentelha, aparenciaMod, empilharArmaduras, soakNatural, MODO_NOME, MODO_ORDEM, SOAK_CATS, regras } from './calc';
import ATTRS_D from '../data/atributos.json';
import HAB_D from '../data/habilidades.json';
import VIRT_D from '../data/virtudes.json';
import CAM_D from '../data/caminhos.json';
import TEC_D from '../data/tecnicas.json';
import ARTE_D from '../data/artes.json';
import EFEITO_D from '../data/efeitos.json';
import RACA_D from '../data/racas.json';
import {
  ARMA, ARMADURA, ESCUDO, ARMAS, ARMADURAS, ESCUDOS,
  CAMPOS_ARMA, CAMPOS_ARMADURA, CAMPOS_ESCUDO, type CampoEquip,
  armaComMod, armaduraComMod, escudoComMod, armadurasDe, baseCampo, valorCampo, temMod,
  danoStr, statsArma, statsArmadura, statsEscudo, sinalNum,
} from './equip';
import { uiConfirmar, uiErro, uiFormulario } from './ui-dialog';

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
  const RACA: Record<string, any> = Object.fromEntries((RACA_D as any[]).map((r) => [r.id, r]));
  const racApMod = () => (RACA[S?.raca]?.aparenciaMod || 0);
  const apEfetiva = (v: number) => Math.max(1, Math.min(12, (v || 1) + racApMod()));
  const el = (id: string) => document.getElementById(id)!;
  const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const ATTR_GRP: Record<string, string> = { fisico: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const HAB_GRP: Record<string, string> = { combate: 'Combate', fisica: 'Físicas', social: 'Sociais', saber: 'Saber', tecnica: 'Técnicas' };
  const SECONDARY: [string, string][] = [
    ['Halterofilismo', 'Corpo'], ['Natação', 'Corpo'], ['Ginástica', 'Corpo'], ['Equilíbrio', 'Corpo'], ['Malabarismo', 'Corpo'], ['Escalada', 'Corpo'],
    ['Liderança', 'Sociais'], ['Etiqueta', 'Sociais'], ['Negociação', 'Sociais'], ['Lábia', 'Sociais'], ['Intimidação', 'Sociais'], ['Atuação', 'Sociais'], ['Sedução', 'Sociais'], ['Disfarce', 'Sociais'], ['Interrogatório', 'Sociais'],
    ['Acerto Arcano', 'Conhecimento'], ['Ritualismo', 'Conhecimento'], ['Cura', 'Conhecimento'], ['Ciências', 'Conhecimento'], ['Comércio', 'Conhecimento'], ['Herbologia', 'Conhecimento'], ['História', 'Conhecimento'], ['Religião', 'Conhecimento'], ['Heráldica', 'Conhecimento'], ['Astronomia', 'Conhecimento'], ['Geografia', 'Conhecimento'], ['Alquimia', 'Conhecimento'], ['Arquitetura', 'Conhecimento'], ['Direito', 'Conhecimento'], ['Bestiário', 'Conhecimento'], ['Estratégia', 'Conhecimento'], ['Genealogia', 'Conhecimento'], ['Folclore', 'Conhecimento'],
    ['Cavalgar', 'Ofício'], ['Ferraria', 'Ofício'], ['Carpintaria', 'Ofício'], ['Costura', 'Ofício'], ['Culinária', 'Ofício'], ['Joalheria', 'Ofício'], ['Couraria', 'Ofício'], ['Alvenaria', 'Ofício'], ['Mineração', 'Ofício'], ['Pesca', 'Ofício'], ['Agricultura', 'Ofício'], ['Navegação', 'Ofício'], ['Marcenaria', 'Ofício'], ['Armadureiro', 'Ofício'], ['Armeiro', 'Ofício'], ['Escrivania', 'Ofício'], ['Cartografia', 'Ofício'], ['Veterinário', 'Ofício'], ['Adestramento', 'Ofício'],
    ['Performance', 'Expressão'], ['Tocar Instrumento', 'Expressão'], ['Canto', 'Expressão'], ['Dança', 'Expressão'], ['Poesia', 'Expressão'], ['Pintura', 'Expressão'], ['Escultura', 'Expressão'], ['Caligrafia', 'Expressão'], ['Contação de Histórias', 'Expressão'],
    ['Ladinagem', 'Subterfúgio'], ['Jogos', 'Subterfúgio'], ['Falsificação', 'Subterfúgio'], ['Abrir Fechaduras', 'Subterfúgio'], ['Contrabando', 'Subterfúgio'], ['Apostar', 'Subterfúgio'], ['Roubo', 'Subterfúgio'], ['Ocultação', 'Subterfúgio'], ['Vigilância Urbana', 'Subterfúgio'],
    ['Energia Espiritual', 'Interior'], ['Meditação', 'Interior'], ['Autocontrole', 'Interior'], ['Concentração', 'Interior'], ['Leitura Corporal', 'Interior'], ['Interpretação de Sonhos', 'Interior'],
  ];

  const SEC_NOME: Record<string, string> = Object.fromEntries(SECONDARY.map(([n]) => [slug(n), n]));
  const TRACO_DESC: Record<string, string> = {
    centelha: 'O nível de poder pessoal, do mortal ao semideus. Destrava os níveis das Proezas e dimensiona Energia e Mana.',
    willpower: 'Reserva de determinação (0–12, piso 0, custo ×2 por nível). Gasta-se para potencializar ações, resistir a medo e manipulação, e conjurar.',
    aparencia: 'Traço próprio (0–12, piso 0, custo ×2 por nível). Modificador direcional na jogada social: ajuda alinhado (seduzir/impressionar), atrapalha invertido (intimidar). A Compostura mascara parte dele.',
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
  function racialAttr(key?: string): number { return key ? (RACA[S.raca]?.atributos?.[key] || 0) : 0; }
  function capFor(kind: string, key?: string): number {
    // Feitiçaria: a trava de nível por Ocultismo foi removida. Basta Centelha > 0 para tocar a magia;
    // a profundidade (nível da Arte) é comprada com XP. (Relação com Ocultismo será refeita nas Trilhas de Feitiçaria.)
    if (kind === 'arte2') return (S.centelha || 0) > 0 ? 6 : 0;
    const rac = kind === 'attr' ? racialAttr(key) : 0;
    const full: Record<string, number> = { attr: 6, skill: 6, skill2: 6, virtue: 6, centelha: 6, willpower: 12, aparencia: 12 };
    if (S.modo === 'evolucao') return (full[kind] ?? 6) + rac;
    if (kind === 'attr' || kind === 'skill') {
      const base = kind === 'attr' ? CREA.atributo : CREA.habilidade;
      const pico = (kind === 'attr' ? CREA.picoAtributo : CREA.picoHabilidade) ?? base;
      if (pico <= base) return base + rac;
      const store: Record<string, number> = kind === 'attr' ? S.attrs : S.skills;
      let outroPico = false;
      for (const k in store) { if (k !== key && (store[k] || 0) > base) { outroPico = true; break; } }
      return (outroPico ? base : pico) + rac;
    }
    const crea: Record<string, number> = { skill2: CREA.habilidade, virtue: 6, centelha: CREA.centelha, willpower: 12, aparencia: 12 };
    return crea[kind] ?? 6;
  }

  // ---- estado ----
  let S: any;
  const OPEN = { cam: {} as Record<string, boolean>, arte: {} as Record<string, boolean> };
  function fresh() {
    // Ficha nova nasce no piso de cada trilha: custo zero até o jogador comprar algo.
    S = { id: {}, attrs: {}, skills: {}, spec: {}, skills2: {}, spec2: {}, virtues: {}, willpower: pisoXp('vontade'), aparencia: pisoXp('aparencia'), centelha: 0, raca: 'humano', tech: {}, arte: {}, efeito: {}, budget: 1500, modo: 'evolucao', equip: { armaduras: [] }, arsenal: [], conjuntos: mkConjuntos(), bolsas: mkBolsas(), defSpec: { esquiva: [], bloqueio: [], social: [], mental: [] } };
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] = pisoXp('atributo')));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] = pisoXp('habilidadePrimaria'); S.spec[h.id] = []; });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] = pisoXp('virtude')));
    SECONDARY.forEach(([n]) => { S.skills2[slug(n)] = 0; S.spec2[slug(n)] = []; });
  }
  // Especialidades: lista nomeada [{s, v}]. Teto por Habilidade = [nível/2] especialidades, cada uma até [nível/2].
  // Também converte o formato antigo (número solto) e reaplica os tetos a cada carga.
  const LINHAS_BOLSA = 6;   // cada tabela nasce com seis linhas em branco
  const linhaBolsa = () => ({ item: '', peso: '', preco: '' });
  const mkItens = () => Array.from({ length: LINHAS_BOLSA }, linhaBolsa);
  function mkBolsas() {
    return [{ nome: 'Mochila', itens: mkItens() }, { nome: 'Equipamentos', itens: mkItens() }, { nome: 'Baú', itens: mkItens() }];
  }
  /**
   * Normaliza uma bolsa e migra o formato antigo (um `texto` corrido) para a tabela:
   * cada linha escrita vira um item, com Peso e Preço em branco. Assim ninguém perde o
   * que já tinha anotado. "Carroça" virou "Baú"; quem tiver renomeado mantém o seu nome.
   */
  function normBolsa(b: any, padrao: string) {
    const nome = String(b?.nome ?? padrao) === 'Carroça' ? 'Baú' : String(b?.nome ?? padrao);
    let itens: any[] = Array.isArray(b?.itens)
      ? b.itens.map((l: any) => ({ item: String(l?.item ?? ''), peso: String(l?.peso ?? ''), preco: String(l?.preco ?? '') }))
      : String(b?.texto ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => ({ item: l, peso: '', preco: '' }));
    while (itens.length < LINHAS_BOLSA) itens.push(linhaBolsa());
    return { nome, itens };
  }
  // Normaliza um slot de mão preservando o que o jogador ajustou: o nome e os números
  // do item improvisado e o `mod` (a variação de qualidade da peça de catálogo).
  function normSlot(s: any, dflt: string) {
    const o: any = { ref: String(s?.ref || dflt) };
    if (s?.nome != null) o.nome = String(s.nome);
    for (const k of ['dado', 'danoBonus', 'acerto']) if (Number.isFinite(Number(s?.[k]))) o[k] = Number(s[k]);
    if (s?.mod && typeof s.mod === 'object') {
      const m: Record<string, number> = {};
      for (const [k, v] of Object.entries(s.mod)) if (Number.isFinite(Number(v))) m[k] = Number(v);
      if (Object.keys(m).length) o.mod = m;
    }
    return o;
  }
  function mkConjuntos() { return [{ habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' }, ativo: true }]; }

  // ---- posse de equipamento (arsenal de armas e peças de armadura) ----
  const novoUid = () => 'p' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  /** Duas peças são a mesma coisa se têm o mesmo item, os mesmos ajustes e o mesmo nome. */
  const assinaturaPeca = (p: any) =>
    [p?.ref, p?.nome || '', JSON.stringify(p?.mod || null), p?.dado ?? '', p?.danoBonus ?? '', p?.acerto ?? ''].join('|');
  const pecaArsenal = (uid: string) => (S.arsenal || []).find((p: any) => p.uid === uid) || null;
  /**
   * Copia os dados da peça do arsenal para dentro do slot da mão.
   *
   * O slot guarda `ref`/`mod`/`nome` além do `uid` de propósito: quem lê a ficha de fora
   * (o rastreador de combate da mesa, via armaDoSlot em equip.ts) só entende esse
   * formato, e não pode depender do arsenal. O arsenal é a fonte, o slot é a cópia, e
   * esta função é o único lugar que as reconcilia.
   */
  function sincronizarSlots() {
    (S.conjuntos || []).forEach((cj: any) => (['habil', 'inabil'] as const).forEach((hand) => {
      const s = cj[hand]; if (!s?.uid) return;
      const p = pecaArsenal(s.uid);
      if (!p) { cj[hand] = { ref: hand === 'habil' ? 'a:desarmado' : 'nada' }; return; }
      cj[hand] = { uid: p.uid, ref: p.ref, ...(p.nome != null ? { nome: p.nome } : {}), ...(p.mod ? { mod: p.mod } : {}),
        ...(p.dado != null ? { dado: p.dado } : {}), ...(p.danoBonus != null ? { danoBonus: p.danoBonus } : {}),
        ...(p.acerto != null ? { acerto: p.acerto } : {}) };
    }));
  }
  // Especialidade = lista de especialidades NOMEADAS [{s, v}], cada uma com um nível v.
  // Teto por perícia: até [nível/2] especialidades, cada uma até [nível/2] níveis.
  // Converte formatos antigos: número solto e lista de nomes por nível (string[]).
  function clampSpecs(arr: any, skill: number): { s: string; v: number }[] {
    const cap = Math.floor((skill || 0) / 2);
    let list: { s: string; v: number }[] = [];
    if (Array.isArray(arr)) {
      if (arr.length && typeof arr[0] === 'string') {
        const m = new Map<string, number>();
        for (const s of arr) { const k = String(s ?? ''); m.set(k, (m.get(k) || 0) + 1); }
        list = [...m].map(([s, v]) => ({ s, v }));
      } else {
        list = arr.map((e: any) => (e && typeof e === 'object') ? { s: String(e.s ?? ''), v: e.v || 0 } : { s: '', v: 0 });
      }
    } else if (typeof arr === 'number' && arr > 0) { list = [{ s: '', v: arr }]; }
    return list.map((e) => ({ s: e.s, v: Math.max(0, Math.min(cap, e.v)) })).filter((e) => e.v > 0).slice(0, cap);
  }
  function normalize() {
    S.id ??= {}; S.attrs ??= {}; S.skills ??= {}; S.spec ??= {}; S.skills2 ??= {}; S.spec2 ??= {}; S.virtues ??= {}; S.tech ??= {}; S.arte ??= {}; S.efeito ??= {}; S.secCol ??= {};
    S.defSpec ??= {}; for (const k of ['esquiva', 'bloqueio', 'social', 'mental']) S.defSpec[k] ??= [];
    // Migração: a Habilidade "Escudos" virou "Bloqueio" (id escudos -> bloqueio); carrega pontos e especialidade antigos.
    if (S.skills.escudos != null && S.skills.bloqueio == null) S.skills.bloqueio = S.skills.escudos;
    if (S.spec.escudos != null && S.spec.bloqueio == null) S.spec.bloqueio = S.spec.escudos;
    delete S.skills.escudos; delete S.spec.escudos; delete S.blkPericia;
    // Migração: Armas de Uma Mão + Armas de Duas Mãos fundiram em "Armas" (fica o maior nível; junta as especialidades).
    if (S.skills['armas-uma-mao'] != null || S.skills['armas-duas-maos'] != null) {
      S.skills.armas = Math.max(S.skills.armas || 0, S.skills['armas-uma-mao'] || 0, S.skills['armas-duas-maos'] || 0);
      const sp = [...(S.spec.armas || []), ...(S.spec['armas-uma-mao'] || []), ...(S.spec['armas-duas-maos'] || [])];
      if (sp.length) S.spec.armas = sp;
      delete S.skills['armas-uma-mao']; delete S.skills['armas-duas-maos'];
      delete S.spec['armas-uma-mao']; delete S.spec['armas-duas-maos'];
    }
    // Migração: perícias primárias que viraram secundárias (Liderança→Sociais, Medicina→Cura, Energia Espiritual→Interior).
    for (const [prim, sec] of [['lideranca', 'lideranca'], ['medicina', 'cura'], ['energia-espiritual', 'energia-espiritual']]) {
      if (S.skills[prim] != null) {
        if (S.skills2[sec] == null) S.skills2[sec] = S.skills[prim];
        if ((S.spec[prim] || []).length && !(S.spec2[sec] || []).length) S.spec2[sec] = S.spec[prim];
        delete S.skills[prim]; delete S.spec[prim];
      }
    }
    S.willpower ??= pisoXp('vontade'); S.aparencia ??= pisoXp('aparencia'); S.centelha ??= 0; S.raca ??= 'humano'; if (!RACA[S.raca]) S.raca = 'humano'; S.budget ??= 1500; S.modo ??= 'evolucao'; S.derivCol ??= true;
    S.equip ??= {};
    if (!Array.isArray(S.equip.armaduras)) S.equip.armaduras = (S.equip.armadura && S.equip.armadura !== 'nenhuma') ? [S.equip.armadura] : [];
    delete S.equip.armadura;
    // Migração: Arma/Escudo únicos viram um conjunto (mão hábil/inábil).
    if (!Array.isArray(S.conjuntos) || !S.conjuntos.length) {
      const arma = S.equip.arma && S.equip.arma !== 'desarmado' ? `a:${S.equip.arma}` : 'a:desarmado';
      const esc = S.equip.escudo && S.equip.escudo !== 'nenhum' ? `e:${S.equip.escudo}` : 'nada';
      S.conjuntos = [{ habil: { ref: arma }, inabil: { ref: esc }, ativo: true }];
    }
    delete S.equip.arma; delete S.equip.escudo;
    S.conjuntos = S.conjuntos.map((c: any) => ({ habil: normSlot(c?.habil, 'a:desarmado'), inabil: normSlot(c?.inabil, 'nada'), ativo: !!c?.ativo, uidH: c?.uidH, uidI: c?.uidI }));
    if (!S.conjuntos.some((c: any) => c.ativo)) S.conjuntos[0].ativo = true;

    // ---- Modelo de POSSE: o personagem tem peças, e usa algumas ----
    // Armadura deixa de ser "um id do catálogo marcado" e passa a ser uma peça própria,
    // com identidade (duas cotas de malha de qualidades diferentes são duas peças), nome
    // editável e imagem. O `armMod`, que era um mapa id→ajustes, entra em cada peça.
    const modsAntigos = (S.equip.armMod && typeof S.equip.armMod === 'object') ? S.equip.armMod : {};
    S.equip.armaduras = S.equip.armaduras.map((p: any) => (typeof p === 'string'
      ? { uid: novoUid(), base: p, mod: modsAntigos[p] ? { ...modsAntigos[p] } : undefined, vestida: true }
      : { uid: p?.uid || novoUid(), base: p?.base, nome: p?.nome || undefined, mod: p?.mod || undefined,
          img: p?.img || undefined, vestida: p?.vestida !== false })
    ).filter((p: any) => ARMADURA[p.base]);
    delete S.equip.armMod;

    // Arsenal: as armas e escudos que o personagem possui. Nasce do que já estava nos
    // conjuntos, então nenhuma ficha perde a arma que tinha escolhido.
    S.arsenal = Array.isArray(S.arsenal) ? S.arsenal.filter((p: any) => p && p.ref).map((p: any) => ({ ...p, uid: p.uid || novoUid() })) : [];
    S.conjuntos.forEach((cj: any) => (['habil', 'inabil'] as const).forEach((hand) => {
      const s = cj[hand];
      if (!s || s.ref === 'nada' || s.ref === 'a:desarmado') return;
      const achado = S.arsenal.find((p: any) => assinaturaPeca(p) === assinaturaPeca(s));
      if (achado) { s.uid = achado.uid; return; }
      const nova = { uid: novoUid(), ref: s.ref, nome: s.nome, mod: s.mod, dado: s.dado, danoBonus: s.danoBonus, acerto: s.acerto };
      S.arsenal.push(nova); s.uid = nova.uid;
    }));
    sincronizarSlots();
    const nomesBolsa = ['Mochila', 'Equipamentos', 'Baú'];
    S.bolsas = (Array.isArray(S.bolsas) && S.bolsas.length)
      ? S.bolsas.map((b: any, i: number) => normBolsa(b, nomesBolsa[i] || 'Bolsa'))
      : mkBolsas();
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] ??= 1));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] ??= 0; S.spec[h.id] = clampSpecs(S.spec[h.id], S.skills[h.id] || 0); });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] ??= 1));
    SECONDARY.forEach(([n]) => { const k = slug(n); S.skills2[k] ??= 0; S.spec2[k] = clampSpecs(S.spec2[k], S.skills2[k] || 0); });
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
  const escapeHtml = (s: string) => String(s).replace(/[&<>"]/g, (c) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' } as Record<string, string>)[c]));
  // Botão de especialidade ao lado da Habilidade (só quando cabe: nível >= 2, cap [nível/2] >= 1).
  // Abre o modal flutuante, onde ficam os quadradinhos (níveis) e os campos de nome.
  const specBtn = (scope: string, key: string, skill: number, count: number) => {
    const dis = Math.floor((skill || 0) / 2) <= 0;
    return `<button class="specbtn${count ? ' has' : ''}" data-specbtn="${scope}:${key}"${dis ? ' disabled' : ''} title="${dis ? 'Especialidades (requer nível 2+)' : `Especialidades${count ? ` (${count})` : ''}`}" aria-label="Especialidades">✦</button>`;
  };
  const specCount = (arr: any[]) => (arr || []).reduce((a: number, e: any) => a + (e.v || 0), 0);
  // Custo de especialidade: acumulativo por nível de CADA especialidade, pela curva afim de regras.json
  // (primária 12·28·48, secundária 6·14·24). Somado sobre as especialidades da perícia.
  const triCost = (v: number, sec = false) => custoEspecialidade(v, sec);
  const specCostSum = (arr: any[], sec = false) => (arr || []).reduce((a: number, e: any) => a + triCost(e.v || 0, sec), 0);
  const specArr = (scope: string, key: string): string[] => scope === 'p' ? (S.spec[key] ||= []) : (S.spec2[key] ||= []);
  const specSkill = (scope: string, key: string) => scope === 'p' ? (S.skills[key] || 0) : (S.skills2[key] || 0);
  const specRerender = (scope: string) => { scope === 'p' ? renderSkills() : renderSecondary(); };
  // Modal flutuante para nomear as especialidades de uma perícia (um campo por nível).
  let specPop: HTMLElement | null = null, specPopFor = '';
  function closeSpecPop() {
    if (specPop) specPop.style.display = 'none';
    const was = specPopFor; specPopFor = '';
    if (!was) return;
    const [scope, key] = was.split(':');
    const arr = scope === 'p' ? S.spec[key] : S.spec2[key];
    if (Array.isArray(arr)) { const p = arr.filter((e: any) => e.v > 0); if (scope === 'p') S.spec[key] = p; else S.spec2[key] = p; }
    specRerender(scope); recompute();
  }
  function openSpecPop(scope: string, key: string) {
    if (opts.readOnly) return;
    const cap = Math.floor(specSkill(scope, key) / 2); if (cap <= 0) return;
    const arr = specArr(scope, key);
    const anchor = document.querySelector<HTMLElement>(`[data-specbtn="${scope}:${key}"]`); if (!anchor) return;
    const nome = anchor.closest('.trow')?.querySelector('.nm')?.textContent?.trim() || 'Habilidade';
    if (!specPop) {
      specPop = document.createElement('div'); specPop.className = 'specpop'; document.body.appendChild(specPop);
      // cliques dentro do popover não sobem até o handler de documento (senão o repaint
      // detacha o alvo e o fecha-ao-clicar-fora acha que foi clique de fora); fechar só aqui ou por clique externo
      specPop.addEventListener('click', (e) => { e.stopPropagation(); if ((e.target as HTMLElement).closest('[data-specpop-close]')) closeSpecPop(); });
    }
    specPop.style.display = 'block'; specPopFor = scope + ':' + key;
    const paint = (focusIdx = -1) => {
      if (!arr.length) arr.push({ s: '', v: 0 });
      const linhas = arr.map((e: any, i: number) => {
        let sq = '';
        for (let d = 1; d <= 3; d++) sq += `<span class="sq${d <= e.v ? ' on' : ''}${d > cap ? ' dis' : ''}" data-spsq="${i}:${d}" title="Nível ${d}"></span>`;
        return `<div class="specpop-row"><input data-spname="${i}" value="${escapeHtml(e.s)}" placeholder="nome da especialidade" /><span class="specpop-sq">${sq}</span><button class="spec-x" data-sprm="${i}" title="Remover" aria-label="Remover">×</button></div>`;
      }).join('');
      const add = arr.length < cap ? `<button class="spec-add" data-spadd type="button">+ Nova Especialidade</button>` : '';
      specPop!.innerHTML = `<div class="specpop-h">Especialidades — ${escapeHtml(nome)} <small>(até ${cap} · nível até ${cap})</small></div>${linhas}${add}<div class="specpop-f"><button class="btn" data-specpop-close type="button">Fechar</button></div>`;
      specPop!.querySelectorAll<HTMLElement>('[data-spsq]').forEach((s) => s.addEventListener('click', () => {
        if (s.classList.contains('dis')) return;
        const [i, d] = s.dataset.spsq!.split(':').map(Number);
        arr[i].v = arr[i].v === d ? d - 1 : Math.min(cap, d);
        paint(); recompute();
      }));
      specPop!.querySelectorAll<HTMLInputElement>('input[data-spname]').forEach((inp) => inp.addEventListener('input', () => { arr[+inp.dataset.spname!].s = inp.value; save(); }));
      specPop!.querySelectorAll<HTMLElement>('[data-sprm]').forEach((b) => b.addEventListener('click', () => { arr.splice(+b.dataset.sprm!, 1); paint(arr.length - 1); recompute(); }));
      const addBtn = specPop!.querySelector<HTMLElement>('[data-spadd]'); if (addBtn) addBtn.addEventListener('click', () => { if (arr.length < cap) { arr.push({ s: '', v: 0 }); paint(arr.length - 1); } });
      if (focusIdx >= 0) (specPop!.querySelectorAll('input[data-spname]')[focusIdx] as HTMLInputElement | null)?.focus({ preventScroll: true });
    };
    // posiciona ANTES de pintar/focar (senão o foco rola a página até o popover ainda sem posição)
    const r = anchor.getBoundingClientRect(), w = 260;
    specPop.style.left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - w - 8)) + 'px';
    specPop.style.top = (window.scrollY + r.bottom + 6) + 'px';
    paint(0);
  }
  const trow = (nm: string, right: string) => `<div class="trow"><span class="nm">${nm}</span><span class="tr-r">${right}</span></div>`;
  const rollBtn = (k: string, key: string) => `<button class="rollv" data-roll="${k}:${key}" title="Enviar ao rolador" aria-label="Rolar">🎲</button>`;

  // ---- render ----
  function renderAttrs() {
    const groups: Record<string, any[]> = { Físicos: [], Sociais: [], Mentais: [] };
    (ATTRS_D as any[]).forEach((a) => groups[ATTR_GRP[a.grupo]].push(a));
    el('attrs').innerHTML = ['Físicos', 'Sociais', 'Mentais'].map((g) =>
      `<div><h3>${g}</h3>${groups[g].map((a) => trow(a.nome, dotsHTML('attr', a.id, S.attrs[a.id], 7, 1) + rollBtn('attr', a.id))).join('')}</div>`).join('');
  }
  function renderPower() {
    let h = trow('<b>Centelha</b> <small>(0–6)</small>', dotsHTML('centelha', 'centelha', S.centelha, 6, 0));
    h += '<h3>Virtudes</h3>';
    (VIRT_D as any[]).forEach((v) => (h += trow(v.nome, dotsHTML('virtue', v.id, S.virtues[v.id], 6, 1))));
    h += '<h3>Força de Vontade <small>(0–12 · piso 0 · ×2)</small></h3>';
    h += trow('Vontade', dotsHTML('willpower', 'willpower', S.willpower, 12, pisoXp('vontade')));
    h += '<h3>Aparência <small>(0–12 · piso 0 · ×2)</small></h3>';
    const am = aparenciaMod(apEfetiva(S.aparencia));
    h += trow(`Aparência <span class="apmod" title="Bônus/Penalidade na jogada social alinhada">${am >= 0 ? '+' : ''}${am}</span>`, dotsHTML('aparencia', 'aparencia', S.aparencia, 12, pisoXp('aparencia')));
    el('power').innerHTML = h;
  }
  // Cada grupo ocupa a largura toda, com o título por cima e as habilidades em três
  // colunas. A ordem alfabética DESCE cada coluna (Armas · Arremesso | Atirador ·
  // Bloqueio | Briga · Esquiva), e não atravessa a linha: por isso as linhas são fixas
  // e o preenchimento é por coluna. Com contagem não divisível por 3 sobra na última.
  // --l3 e --l2: quantas linhas o grupo ocupa em três e em duas colunas. Vão os dois
  // porque a contagem de linhas é o que define o número de colunas nesta técnica, e o
  // CSS sozinho não sabe dividir a quantidade de itens.
  const grupoHTML = (titulo: string, linhas: string[]) => {
    const n = Math.max(1, linhas.length);
    return `<section class="hgrupo"><h3>${titulo}</h3><div class="hgrid" style="--l3:${Math.ceil(n / 3)};--l2:${Math.ceil(n / 2)}">${linhas.join('')}</div></section>`;
  };

  function renderSkills() {
    const groups: Record<string, any[]> = { Combate: [], Físicas: [], Sociais: [], Saber: [], Técnicas: [] };
    (HAB_D as any[]).filter((s) => !s.secundaria).forEach((s) => groups[HAB_GRP[s.grupo]].push(s));
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' })));
    const ordem = ['Combate', 'Físicas', 'Sociais', 'Saber', 'Técnicas'];
    el('skills').innerHTML = ordem.filter((g) => (groups[g] || []).length).map((g) =>
      grupoHTML(g, groups[g].map((s) => trow(s.nome, dotsHTML('skill', s.id, S.skills[s.id], 6, 0) + specBtn('p', s.id, S.skills[s.id] || 0, specCount(S.spec[s.id])))))).join('');
  }
  function renderSecondary() {
    const groups: Record<string, string[]> = {}; SECONDARY.forEach(([n, g]) => (groups[g] ??= []).push(n));
    Object.values(groups).forEach((arr) => arr.sort((a, b) => a.localeCompare(b, 'pt', { sensitivity: 'base' })));
    const ordem = ['Corpo', 'Sociais', 'Conhecimento', 'Ofício', 'Expressão', 'Subterfúgio', 'Interior'];
    el('secondary').innerHTML = ordem.filter((g) => (groups[g] || []).length).map((g) =>
      grupoHTML(g, groups[g].map((n) => { const k = slug(n); return trow(n, dotsHTML('skill2', k, S.skills2[k] || 0, 6, 0) + specBtn('s', k, S.skills2[k] || 0, specCount(S.spec2[k]))); }))).join('');
  }
  function renderCaminhos() {
    const card = (cam: string) => {
      const techs = CAMTREE[cam] || [];
      const sel = techs.filter(([id]) => S.tech[id]);
      const cost = sel.reduce((s, [, , b]) => s + custoTecnica(b), 0);
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
        return `<div class="techrow"><span class="${cls}" data-tech="${id}"${title}>${!owned && !ok ? '🔒 ' : ''}${nome} <small>N${b} · ${custoTecnica(b)}</small></span>${desc}</div>`;
      }).join('');
      return `<div class="cam"><div class="cam-head" data-camtog="${cam}"><span class="chev">${open ? '▾' : '▸'}</span><span class="cam-nm">Proeza ${CAM_NOME[cam]}</span><span class="cam-meta">${sel.length ? `${sel.length} téc · ${cost} XP` : '—'}</span></div><div class="cam-body" style="display:${open ? 'block' : 'none'}">${rows}</div></div>`;
    };
    el('tecnicas').innerHTML = col3(CAM_ORDER, card);
  }
  function renderArtes() {
    const card = (a: any) => {
      const lvl = S.arte[a.id] || 0, cost = custoArte(lvl), open = OPEN.arte[a.id];
      const fx = a.niveis.map((n: any) => `<div class="fxline${n.nivel <= lvl ? ' hi' : ''}">${n.nivel} — <b>${n.nome}</b>: ${n.efeito}</div>`).join('');
      return `<div class="cam"><div class="cam-head"><span class="chev" data-artetog="${a.id}">${open ? '▾' : '▸'} ${a.nome}</span>${dotsHTML('arte2', a.id, lvl, 6, 0)}<span class="cam-meta">${lvl ? `nível ${lvl} · ${cost} XP` : '—'}</span></div><div class="cam-body" style="display:${open ? 'block' : 'none'}">${fx}</div></div>`;
    };
    el('artes').innerHTML = col3(ARTE_D as any[], card);
    renderEfeitos();
  }
  // Efeitos Especiais: só aparecem os que o personagem alcança, ou seja, aqueles
  // cujo nível é menor ou igual ao nível dele em pelo menos uma das Artes que os comportam.
  const idRef = (x: any) => (typeof x === 'string' ? x : x?.id);
  function renderEfeitos() {
    const box = document.getElementById('efeitos-esp');
    if (!box) return;
    const disp = (EFEITO_D as any[])
      .map((e) => ({ e, artes: e.artes.map((x: any) => idRef(x.id)).filter((id: string) => (S.arte[id] || 0) >= e.nivel) }))
      .filter((x) => x.artes.length)
      .sort((a, b) => a.e.nivel - b.e.nivel || a.e.nome.localeCompare(b.e.nome, 'pt'));
    if (!disp.length) {
      box.innerHTML = '<div class="ef-vazio muted">Os Efeitos Especiais aparecem aqui quando você tiver uma Arte no nível que cada um exige.</div>';
      return;
    }
    const nomeArte = (id: string) => (ARTE_D as any[]).find((a) => a.id === id)?.nome || id;
    // Um Efeito pode caber em várias Artes: ele aparece no grupo de CADA Arte que o
    // comporta. A compra é uma só (mesmo id), então marcar num grupo marca em todos —
    // o clique redesenha a lista inteira e o XP é somado uma vez, sobre EFEITO_D.
    const item = ({ e, artes }: any, arteAtual: string) => {
      const on = !!S.efeito[e.id];
      // Área e Volume abrem o cartão de formas ao passar o mouse (ver FormasPop)
      const rot = (n: string) => {
        const f = n.toLowerCase().startsWith('volume') ? 'volume' : /^(á|a)rea/.test(n.toLowerCase()) ? 'area' : '';
        return f ? `<span data-formas="${f}" tabindex="0">${n}</span>` : n;
      };
      const par = e.parametros
        .map((p: any) => (p.tipo === 'fixo' ? `${rot(p.nome)}: ${p.valor}` : p.regua ? `${rot(p.nome)}: ${p.regua === 'longa' ? 'Longa' : 'Breve'}` : rot(p.nome)))
        .join(' · ');
      const outras = artes.filter((id: string) => id !== arteAtual).map(nomeArte);
      const compart = outras.length
        ? `<span class="ef-i-ar muted" title="O mesmo Efeito também cabe nestas Artes suas; paga-se uma vez só">também em ${outras.join(', ')}</span>`
        : '';
      return `<label class="ef-item${on ? ' on' : ''}"><input type="checkbox" data-efeito="${e.id}"${on ? ' checked' : ''}${opts.readOnly ? ' disabled' : ''} />
        <span class="ef-i-nv">${e.nivel}</span>
        <span class="ef-i-nm">${e.nome}</span>
        ${compart}
        <span class="ef-i-par muted">${par}</span>
        <span class="ef-i-xp">${custoEfeito(e.nivel)} XP</span></label>`;
    };
    // um grupo por Arte, na ordem do catálogo; só as Artes que têm Efeitos alcançáveis
    const grupos = (ARTE_D as any[])
      .map((a) => ({
        arte: a,
        itens: disp
          .filter((x) => x.artes.includes(a.id))
          .sort((p, q) => p.e.nivel - q.e.nivel || p.e.nome.localeCompare(q.e.nome, 'pt')),
      }))
      .filter((g) => g.itens.length);
    const blocos = grupos.map((g) => {
      const comprados = g.itens.filter((x) => S.efeito[x.e.id]).length;
      return `<div class="ef-grupo">
        <div class="ef-g-head"><span class="ef-g-nm">${g.arte.nome}</span>
          <span class="ef-g-nv">nível ${S.arte[g.arte.id] || 0}</span>
          <span class="ef-g-qtd muted">${comprados ? `${comprados} de ${g.itens.length}` : `${g.itens.length} disponíveis`}</span></div>
        <div class="ef-esp-list">${g.itens.map((x) => item(x, g.arte.id)).join('')}</div>
      </div>`;
    }).join('');
    const gastos = (EFEITO_D as any[]).filter((e) => S.efeito[e.id]).reduce((s, e) => s + custoEfeito(e.nivel), 0);
    box.innerHTML = `<div class="ef-esp-head"><b>Efeitos Especiais</b><span class="muted">${gastos ? `${gastos} XP` : 'nenhum comprado'}</span></div>${blocos}`;
  }
  const A = (id: string) => S.attrs[id] || 0, SK = (id: string) => S.skills[id] || 0, VI = (id: string) => S.virtues[id] || 0;
  // Atributo do ACERTO por perícia: tiro = Percepção; arremesso = Destreza; corpo a corpo (armas/punhos) = o maior entre Destreza e Força.
  const ataqueAtrib = (w: any): number => {
    const per = w?.pericia;
    if (per === 'atirador') return A('percepcao');
    if (per === 'arremesso') return A('destreza');
    return Math.max(A('destreza'), A('forca'));
  };
  // ===== Equipamento: conjuntos de armas (mão hábil / inábil) =====
  const IMPROV = { nome: 'Improvisado', dado: 1, danoBonus: 0, acerto: -2, defesaArma: 0, maos: 1, ticks: 5, folego: 0, atrib: 'forca', pericia: 'briga', tags: [] as string[], tipoDano: 'impacto', forcaMult: 1 };
  const clampImprov = (v: any, lo: number, hi: number, dflt: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : dflt; };
  function itemDe(slot: any) {
    const ref = (slot && slot.ref) || 'nada';
    if (ref === 'c') {
      const w = { ...IMPROV, nome: (slot && slot.nome) || 'Improvisado',
        dado: clampImprov(slot?.dado, 1, 2, IMPROV.dado),
        danoBonus: clampImprov(slot?.danoBonus, -2, 2, IMPROV.danoBonus),
        acerto: clampImprov(slot?.acerto, -6, 6, IMPROV.acerto) };
      return { kind: 'custom', nome: w.nome, def: 0, pen: 0, w };
    }
    if (ref.startsWith('e:')) {
      const base = ESCUDO[ref.slice(2)];
      if (base) { const s = escudoComMod(base, slot?.mod); return { kind: 'escudo', nome: base.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, habilProjetil: !!s.habilProjetil, base, s }; }
    }
    if (ref.startsWith('a:')) {
      const base = ARMA[ref.slice(2)];
      if (base) { const w = armaComMod(base, slot?.mod); return { kind: 'arma', nome: base.nome, def: w.defesaArma || 0, pen: 0, w, base }; }
    }
    return { kind: 'nada', nome: '—', def: 0, pen: 0 };
  }
  /** Peças de armadura vestidas, já com os ajustes do jogador. */
  const pecasArmadura = () => armadurasDe(S);
  const it2H = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && it.w.maos === 2;
  const itVers = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && (it.w.tags || []).includes('versátil');
  function conjAtivo() { const cs = (S.conjuntos || []); return cs.find((c: any) => c.ativo) || cs[0] || { habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' } }; }
  function calcConj(cj: any) {
    const C = S.centelha || 0, forca = A('forca');
    const armorPen = empilharArmaduras(pecasArmadura()).penalidade || 0;
    const habil = itemDe(cj.habil);
    const inabil = it2H(habil) ? { kind: 'nada', nome: '—', def: 0, pen: 0 } : itemDe(cj.inabil);
    const atk = (habil.kind === 'arma' || habil.kind === 'custom') ? habil.w : ARMA['desarmado'];
    const soma = ataqueAtrib(atk) + (S.skills[atk.pericia] || S.skills2[atk.pericia] || 0);
    const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const flat = (atk.acerto || 0) + ataqueCentelha(C) - armorPen;
    const dist = (atk.tags || []).includes('distância');
    const fm = regras.derivados.danoForca as any;
    const db = atk.danoBonus || 0;
    const capF = atk.forcaCap != null ? Math.min(forca, atk.forcaCap) : forca;
    const inabilArmaOcupada = (inabil.kind === 'arma' || inabil.kind === 'custom');
    const versoes: { rot: string; ap: number }[] = [];
    if (!dist && itVers(habil)) {
      // Versátil: com a outra mão ocupada (arma OU escudo) vai a uma mão; com a outra mão
      // livre, é empunhada com as duas e a Força entra dobrada. Antes a ficha mostrava as
      // duas versões e deixava a escolha no ar; agora o marcador de uso já decidiu.
      const inabilOcupada = inabil.kind !== 'nada';
      versoes.push(inabilOcupada
        ? { rot: '', ap: db + forca * (atk.forcaMult ?? fm.umaMao) }
        : { rot: '2 mãos', ap: db + forca * fm.duasMaos });
    } else {
      const mult = dist ? (atk.forcaMult ?? 1) : (atk.maos === 2 ? (atk.forcaMult ?? fm.duasMaos) : (atk.forcaMult ?? fm.umaMao));
      versoes.push({ rot: '', ap: db + capF * mult });
    }
    const reqForca = (atk.forcaMin && forca < atk.forcaMin) ? atk.forcaMin : 0;
    // Empunhadura dupla: se a mão inábil também é arma, ela rende um 2º ataque (hábil −1d6, inábil −2d6).
    const inabilArma = (inabil.kind === 'arma' || inabil.kind === 'custom') ? inabil.w : null;
    let dupla: any = null;
    if (inabilArma) {
      const somaI = ataqueAtrib(inabilArma) + (S.skills[inabilArma.pericia] || S.skills2[inabilArma.pericia] || 0);
      const distI = (inabilArma.tags || []).includes('distância');
      const capFI = inabilArma.forcaCap != null ? Math.min(forca, inabilArma.forcaCap) : forca;
      const multI = distI ? (inabilArma.forcaMult ?? 1) : (inabilArma.forcaMult ?? fm.umaMao);
      const ambi = !!(S.tech && S.tech['ambidestria']);
      dupla = {
        habilAp: versoes[0].ap,
        inabilDados: Math.floor(somaI / 2), inabilBonus: somaI % 2 === 1 ? 2 : 0,
        inabilFlat: (inabilArma.acerto || 0) + ataqueCentelha(C) - armorPen,
        inabilDado: inabilArma.dado, inabilAp: (inabilArma.danoBonus || 0) + capFI * multI,
        inabilPen: ambi ? 1 : 2, ambi,
      };
    }
    return { habil, inabil, atk, dados, bonus, flat, dist, versoes, reqForca, dupla, defSum: (habil.def || 0) + (inabil.def || 0), penSum: (habil.pen || 0) + (inabil.pen || 0), armorPen };
  }
  const sgn = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
  // Cada arma da lista já mostra os próprios números: Velocidade / Acerto / Dano / Defesa.
  function optsItens(sel: string, semVazio = false) {
    const armas = ARMAS.map((w) => `<option value="a:${w.id}"${sel === 'a:' + w.id ? ' selected' : ''}>${w.nome}: ${statsArma(w)}</option>`).join('');
    const escudos = ESCUDOS.filter((s) => s.id !== 'nenhum').map((s) => `<option value="e:${s.id}"${sel === 'e:' + s.id ? ' selected' : ''}>${s.nome}: ${statsEscudo(s)}</option>`).join('');
    // `semVazio`: a mão já traz a própria opção de vazio ("desarmado" ou "mão livre"),
    // então pedir a lista sem o "Nada" evita duas opções com o mesmo valor.
    const vazio = semVazio ? '' : `<option value="nada"${sel === 'nada' ? ' selected' : ''}>Nada</option>`;
    return `<optgroup label="Armas (Vel/Acerto/Dano/Defesa)">${armas}</optgroup><optgroup label="Escudos">${escudos}</optgroup>${vazio}<option value="c"${sel === 'c' ? ' selected' : ''}>Personalizado…</option>`;
  }

  // ===== Arsenal: as armas e escudos que o personagem POSSUI =====
  // Os conjuntos de mãos escolhem daqui, não do catálogo inteiro. É o que faz a imagem
  // pertencer à peça: a mesma espada usada em dois conjuntos mostra a mesma foto.
  const nomePeca = (p: any) => p.nome || itemDe(p).nome;
  /** Item improvisado: não tem catálogo, então nome e números são digitados na própria peça. */
  function improvisado(p: any, ro: boolean) {
    const dis = ro ? ' disabled' : '';
    const d = (v: any, def: number) => (v ?? def);
    return `<input class="eq-nome-in" data-ars-nome="${p.uid}" value="${escapeHtml(p.nome || '')}" placeholder="nome do item"${dis} aria-label="Nome do item improvisado" />
      <div class="eq-improv">
        <label>Dado<select data-ars-improv="${p.uid}:dado"${dis}>${[1, 2].map((v) => `<option value="${v}"${d(p.dado, 1) == v ? ' selected' : ''}>${v}d6</option>`).join('')}</select></label>
        <label>Bônus<select data-ars-improv="${p.uid}:danoBonus"${dis}>${[-2, -1, 0, 1, 2].map((v) => `<option value="${v}"${d(p.danoBonus, 0) == v ? ' selected' : ''}>${v >= 0 ? '+' + v : '−' + Math.abs(v)}</option>`).join('')}</select></label>
        <label>Acerto<input type="number" data-ars-improv="${p.uid}:acerto" value="${d(p.acerto, -2)}" min="-6" max="6" step="1"${dis} /></label>
      </div>
      <span class="eq-improv-nota muted">Frágil: costuma quebrar no 1º ou 2º golpe.</span>`;
  }
  /**
   * O id de catálogo da peça, que é o que dá nome à classe da arte do sistema
   * (`.arte-espada-longa`). Arma e escudo guardam em `ref` com prefixo; armadura
   * guarda em `base`. Item improvisado não tem arte: é objeto de ocasião.
   */
  function idDeArte(p: any): string {
    const ref = p && p.ref;
    if (typeof ref === 'string' && (ref.startsWith('a:') || ref.startsWith('e:'))) return ref.slice(2);
    return (p && p.base) || '';
  }
  /**
   * Espaço da imagem. São três estados, nesta ordem de preferência:
   *
   * 1. imagem do jogador: o quadro AMPLIA (como a arte do bestiário) e a troca
   *    vai para o ✎ do canto, senão não haveria como ver a arte inteira sem abrir
   *    o seletor por engano;
   * 2. arte do sistema (a gravura da peça, recortada do atlas da categoria): o ✎
   *    continua no canto, porque trocar por uma foto sua segue valendo;
   * 3. nada: o quadro inteiro é o seletor de arquivo.
   *
   * A arte do sistema não abre no zoom de propósito: quem manda nela é o CSS
   * (`.arte-<id>` recorta o atlas), e o zoom trabalha com uma URL de imagem só.
   */
  function imgSlot(chave: string, url: string | undefined, classe: string, ro: boolean, nome = '', arte = '') {
    if (url) {
      const est = ` style="background-image:url('${escapeHtml(url)}')"`;
      return `<div class="eq-img ${classe} tem"${est}>
        <button type="button" class="eq-img-zoom" data-eq-zoom="${escapeHtml(url)}" data-eq-zoom-nome="${escapeHtml(nome)}" title="Ampliar" aria-label="Ampliar a imagem de ${escapeHtml(nome)}"></button>
        ${ro ? '' : `<label class="eq-img-troca" title="Trocar a imagem"><input type="file" accept="image/*" data-eq-img="${chave}" hidden /><span aria-hidden="true">✎</span><span class="sr-only">Trocar a imagem</span></label>
        <button type="button" class="eq-img-rm" data-eq-img-rm="${chave}" title="Tirar a imagem" aria-label="Tirar a imagem">×</button>`}
      </div>`;
    }
    if (arte) {
      const desenho = `<span class="eq-arte arte-${escapeHtml(arte)}" role="img" aria-label="${escapeHtml(nome || 'Arte da peça')}"></span>`;
      if (ro) return `<span class="eq-img ${classe} arte">${desenho}</span>`;
      return `<div class="eq-img ${classe} arte">
        ${desenho}
        <label class="eq-img-troca" title="Usar uma imagem sua"><input type="file" accept="image/*" data-eq-img="${chave}" hidden /><span aria-hidden="true">✎</span><span class="sr-only">Usar uma imagem sua</span></label>
      </div>`;
    }
    if (ro) return `<span class="eq-img ${classe}" aria-hidden="true"></span>`;
    return `<label class="eq-img ${classe}" title="Escolher uma imagem">
      <input type="file" accept="image/*" data-eq-img="${chave}" hidden />
      <span class="eq-img-ph"><b>＋</b>imagem</span>
    </label>`;
  }
  /**
   * A peça do arsenal correspondente a um item do catálogo, criada na hora se ainda não
   * existir. O arsenal continua sendo onde moram imagem e ajustes, mas deixou de ter
   * bloco próprio na tela: quem o alimenta é o seletor de cada mão. Uma peça por item de
   * catálogo, de propósito, para a mesma espada em dois conjuntos ter a mesma foto.
   * Item improvisado é sempre uma peça nova, porque é um objeto de ocasião.
   */
  function pecaPara(ref: string) {
    S.arsenal ||= [];
    if (ref === 'c') {
      const nova = { uid: novoUid(), ref: 'c', nome: '', dado: 1, danoBonus: 0, acerto: -2 };
      S.arsenal.push(nova); return nova;
    }
    let p = S.arsenal.find((x: any) => x.ref === ref);
    if (!p) { p = { uid: novoUid(), ref }; S.arsenal.push(p); }
    return p;
  }
  /** Como a peça está empunhada no conjunto em uso: 'nada', 'habil' ou 'inabil'. */
  function papelDaPeca(uid: string): 'nada' | 'habil' | 'inabil' {
    const cj = conjAtivo();
    if (cj.habil?.uid === uid) return 'habil';
    if (cj.inabil?.uid === uid) return 'inabil';
    return 'nada';
  }
  const ehDuasMaos = (p: any) => {
    const w = p?.ref?.startsWith('a:') ? ARMA[p.ref.slice(2)] : null;
    return !!w && w.maos === 2;
  };
  /**
   * Aplica o marcador de uma arma. As regras vieram do pedido:
   *   · escolher a mão hábil desequipa a arma que estava nela;
   *   · uma arma de duas mãos desequipa as duas mãos;
   *   · e a mão inábil não é oferecida para arma de duas mãos.
   */
  function marcarUso(uid: string, papel: 'nada' | 'habil' | 'inabil') {
    const p = pecaArsenal(uid); if (!p) return;
    const cj = conjAtivo();
    const vazio = (hand: 'habil' | 'inabil') => ({ ref: hand === 'habil' ? 'a:desarmado' : 'nada' });
    const posta = { uid: p.uid, ref: p.ref };
    if (papel === 'nada') {
      if (cj.habil?.uid === uid) cj.habil = vazio('habil');
      if (cj.inabil?.uid === uid) cj.inabil = vazio('inabil');
    } else if (papel === 'habil') {
      if (cj.inabil?.uid === uid) cj.inabil = vazio('inabil');
      cj.habil = posta;
      // arma de duas mãos ocupa as duas, então a outra mão esvazia
      if (ehDuasMaos(p)) cj.inabil = vazio('inabil');
    } else {
      if (cj.habil?.uid === uid) cj.habil = vazio('habil');
      // se a mão hábil segurava uma arma de duas mãos, ela sai para liberar esta mão
      const naHabil = cj.habil?.uid ? pecaArsenal(cj.habil.uid) : null;
      if (naHabil && ehDuasMaos(naHabil)) cj.habil = vazio('habil');
      cj.inabil = posta;
    }
    sincronizarSlots();
  }
  function renderArsenal() {
    const ro = !!opts.readOnly;
    const cards = (S.arsenal || []).map((p: any) => {
      const it = itemDe(p), chave = `ars:${p.uid}`;
      const papel = papelDaPeca(p.uid), duasMaos = ehDuasMaos(p);
      const campos = (it.kind === 'arma' || it.kind === 'escudo') ? camposItem(it) : null;
      const ajustada = campos ? temMod(it.base, p.mod, campos) : false;
      const marca = (v: 'nada' | 'habil' | 'inabil', rot: string, off = false) =>
        `<label class="eq-uso-op${papel === v ? ' on' : ''}${off ? ' off' : ''}">
          <input type="radio" name="uso-${p.uid}" data-uso="${p.uid}:${v}"${papel === v ? ' checked' : ''}${(ro || off) ? ' disabled' : ''} />
          <span>${rot}</span></label>`;
      return `<div class="eq-peca${papel !== 'nada' ? ' em-uso' : ''}${ajustada ? ' ajustado' : ''}" data-ars="${p.uid}">
        ${imgSlot(chave, p.img, it.kind === 'escudo' ? 'escudo' : 'arma', ro, nomePeca(p), idDeArte(p))}
        <div class="eq-peca-corpo">
          <div class="eq-peca-cab">
            <div class="eq-peca-nome">${escapeHtml(nomePeca(p))}</div>
            ${(it.w?.tags || []).length ? `<div class="eq-tags">${it.w.tags.map((t: string) => `<span class="eq-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          </div>
          ${it.kind === 'arma' ? statsBlocos(it.w) : it.kind === 'escudo' ? statsBlocosEscudo(it.s) : ''}
          ${p.ref === 'c' ? improvisado(p, ro) : ''}
          <div class="eq-uso" role="radiogroup" aria-label="Como ${escapeHtml(nomePeca(p))} está empunhada">
            ${marca('nada', 'guardada')}${marca('habil', 'mão hábil')}${marca('inabil', 'mão inábil', duasMaos)}
          </div>
          ${ro ? '' : `<div class="eq-acoes">
            ${campos ? `<button type="button" class="eq-ed" data-eqm-tog="${chave}" title="Ajustar os valores desta peça" aria-expanded="${modAberto.has(chave)}">✎ ajustar</button>` : '<span></span>'}
            <button type="button" class="eq-rm" data-ars-rm="${p.uid}" title="Descartar esta peça" aria-label="Excluir ${escapeHtml(nomePeca(p))}">Excluir</button>
          </div>`}
        </div>
        ${campos ? painelMod(chave, it.base, p.mod, campos, ro) : ''}
      </div>`;
    }).join('');
    const adicionar = ro ? '' : `<div class="eq-add">
      <label>Adicionar arma ou escudo
        <select data-ars-add><option value="">escolher do catálogo…</option>${optsItens('', true)}</select>
      </label>
    </div>`;
    const vazio = `<p class="muted eq-vazio">${ro ? 'Sem armas.' : 'Nenhuma arma ainda: escolha uma no catálogo.'}</p>`;
    el('eq-arsenal').innerHTML = cards || vazio;
    el('eq-arsenal-add').innerHTML = adicionar;
  }
  /** Descarta peças que ninguém usa e que não guardam nada do jogador (sem imagem nem ajuste). */
  function limparArsenal() {
    const usados = new Set<string>();
    (S.conjuntos || []).forEach((cj: any) => { if (cj.habil?.uid) usados.add(cj.habil.uid); if (cj.inabil?.uid) usados.add(cj.inabil.uid); });
    S.arsenal = (S.arsenal || []).filter((p: any) => usados.has(p.uid) || p.img || p.mod || (p.ref === 'c' && p.nome));
  }
  /** Os quatro números da arma como blocos, no lugar da linha "5/+2/1d6/+1". */
  const statsBlocos = (w: any) => `<div class="eq-nums">
    <span class="eq-n"><b>Veloc.</b>${w.ticks}</span>
    <span class="eq-n"><b>Acerto</b>${sgn(w.acerto || 0)}</span>
    <span class="eq-n"><b>Dano</b>${danoStr(w)}</span>
    <span class="eq-n def"><b>Defesa</b>${sgn(w.defesaArma || 0)}</span></div>`;
  const statsBlocosEscudo = (s: any) => `<div class="eq-nums">
    <span class="eq-n def"><b>Defesa</b>${sgn(s.bloqCaC || 0)}</span>
    <span class="eq-n pen"><b>Penalid.</b>${s.penalidade ? '−' + s.penalidade : '0'}</span>
    ${s.habilProjetil ? '<span class="eq-n"><b>Projétil</b>hábil</span>' : ''}</div>`;

  // ===== Ajuste de peça: os números do catálogo viram editáveis =====
  // Serve para a variação de qualidade (uma Espada Longa Ótima, um gambeson puído):
  // a peça continua sendo a do catálogo, só com os valores trocados na ficha.
  const modAberto = new Set<string>();   // painéis abertos, por chave ("0:habil", "arm:couro")
  function campoMod(chave: string, c: CampoEquip, base: any, mod: any, ro: boolean) {
    const v = valorCampo(base, mod, c), orig = baseCampo(base, c);
    return `<label class="eqm-c${v !== orig ? ' dif' : ''}" data-eqm-c="${chave}:${c.k}"><span>${c.rot}</span>` +
      `<input type="number" data-eqm="${chave}:${c.k}" value="${v}" min="${c.min}" max="${c.max}" step="1"${ro ? ' disabled' : ''} title="catálogo: ${c.sinal ? sgn(orig) : orig}" /></label>`;
  }
  function painelMod(chave: string, base: any, mod: any, campos: CampoEquip[], ro: boolean) {
    return `<div class="eq-mod" data-eq-pan="${chave}"${modAberto.has(chave) ? '' : ' hidden'}>${campos.map((c) => campoMod(chave, c, base, mod, ro)).join('')}` +
      `${ro ? '' : `<button type="button" class="eqm-reset" data-eqm-reset="${chave}">restaurar</button>`}</div>`;
  }
  const camposItem = (it: any) => (it.kind === 'arma' ? CAMPOS_ARMA : CAMPOS_ESCUDO);
  function statsConj(c: any, trava: boolean) {
    const atk = `${c.dados}d6${c.bonus ? '+2' : ''}${c.flat ? ' ' + sgn(c.flat) : ''}`;
    const dano = c.versoes.map((v: any) => `${v.rot ? v.rot + ': ' : ''}${c.atk.dado}d6${v.ap ? ' ' + sgn(v.ap) : ''}`).join(' · ');
    return `<b>Acerto</b> ${atk} · <b>Dano</b> ${dano} · <b>Defesa</b> ${sgn(c.defSum)}` +
      `${trava ? ' <span class="muted">(2 mãos: inábil travada)</span>' : ''}` +
      `${c.reqForca ? ` · <span class="conj-req">requer Força ${c.reqForca}</span>` : ''}`;
  }
  function duplaConj(c: any) {
    if (!c.dupla) return '';
    const p0 = (n: number) => Math.max(0, n);
    const pool = (d: number, b: number, f: number) => `${p0(d)}d6${b ? '+2' : ''}${f ? ' ' + sgn(f) : ''}`;
    const dm = (dado: number, ap: number) => `${dado}d6${ap ? ' ' + sgn(ap) : ''}`;
    return `<div class="conj-dupla"><b>Ataque duplo</b> hábil −1d6: ${pool(c.dados - 1, c.bonus, c.flat)} (${dm(c.atk.dado, c.dupla.habilAp)}) · inábil −${c.dupla.inabilPen}d6: ${pool(c.dupla.inabilDados - c.dupla.inabilPen, c.dupla.inabilBonus, c.dupla.inabilFlat)} (${dm(c.dupla.inabilDado, c.dupla.inabilAp)}) <span class="muted">· guarda −4 até seu turno${c.dupla.ambi ? ' · Ambidestria' : ''}</span></div>`;
  }
  function renderConjuntos() {
    const ro = !!opts.readOnly;
    el('eq-conjuntos').innerHTML = (S.conjuntos || []).map((cj: any, i: number) => {
      const c = calcConj(cj); const trava = it2H(c.habil);
      const mao = (hand: 'habil' | 'inabil') => {
        const rot = hand === 'habil' ? 'Mão hábil' : 'Mão inábil';
        const travada = hand === 'inabil' && trava;
        const it = hand === 'habil' ? c.habil : c.inabil;
        const p = travada ? null : (cj[hand]?.uid ? pecaArsenal(cj[hand].uid) : null);
        const vazioRot = hand === 'habil' ? '— desarmado (briga) —' : '— mão livre —';
        // Este painel virou espelho: quem edita imagem, números e improvisado é o card do
        // arsenal, para os controles não existirem em dois lugares com a mesma chave.
        const corpo = travada
          ? '<div class="conj-vazia">Ocupada: a arma da mão hábil usa as duas</div>'
          : p
            ? `<div class="conj-peca">
                 ${imgSlot('', p.img, it.kind === 'escudo' ? 'escudo' : 'arma', true, nomePeca(p), idDeArte(p))}
                 <div class="conj-peca-corpo">
                   <div class="eq-peca-nome">${escapeHtml(nomePeca(p))}</div>
                   ${it.kind === 'arma' ? statsBlocos(it.w) : it.kind === 'escudo' ? statsBlocosEscudo(it.s) : ''}
                 </div>
               </div>`
            : `<div class="conj-vazia">${hand === 'habil' ? 'Desarmado: ataca de briga' : 'Mão livre'}</div>`;
        // o seletor volta a oferecer o CATÁLOGO: sem o bloco do arsenal, é por aqui que
        // uma arma entra na ficha. A peça correspondente é criada (ou reaproveitada) na hora.
        const sel = travada ? 'nada' : (p ? p.ref : 'nada');
        return `<div class="conj-mao">
          <div class="conj-mao-rot">${rot}</div>
          ${corpo}
          <label class="conj-esc"><span class="sr-only">${rot}</span><select data-conj-sel="${i}:${hand}"${(ro || travada) ? ' disabled' : ''}>
            <option value="nada"${sel === 'nada' ? ' selected' : ''}>${vazioRot}</option>${optsItens(sel, true)}
          </select></label>
        </div>`;
      };
      return `<div class="conjunto${cj.ativo ? ' ativo' : ''}" data-conj="${i}">
        <div class="conj-top"><label class="conj-uso"><input type="radio" name="conj-ativo" data-conj-uso="${i}"${cj.ativo ? ' checked' : ''}${ro ? ' disabled' : ''}/> em uso</label>${(S.conjuntos.length > 1 && !ro) ? `<button class="conj-rm" data-conj-rm="${i}" title="Remover" aria-label="Remover">×</button>` : ''}</div>
        <div class="conj-hands">${mao('habil')}${mao('inabil')}</div>
        <div class="conj-stats">${statsConj(c, trava)}</div>
        <div class="conj-dupla-wrap">${duplaConj(c)}</div>
      </div>`;
    }).join('');
  }
  /** Atualiza só os totais de um conjunto, sem refazer o HTML (não rouba o foco de quem digita). */
  function refreshConj(i: number) {
    const root = el('eq-conjuntos').querySelector<HTMLElement>(`[data-conj="${i}"]`);
    if (!root || !S.conjuntos[i]) return;
    const c = calcConj(S.conjuntos[i]), trava = it2H(c.habil);
    const st = root.querySelector('.conj-stats'); if (st) st.innerHTML = statsConj(c, trava);
    const dp = root.querySelector('.conj-dupla-wrap'); if (dp) dp.innerHTML = duplaConj(c);
  }
  function renderDerived() {
    const C = S.centelha, W = S.willpower, integ = SK('integridade');
    const r = (l: string, v: any, calc: string, extra = false) => `<div class="derv${extra ? ' derv-extra' : ''}"><span class="dl">${l}</span><span class="dv" data-calc="${escapeHtml(calc)}">${v}</span></div>`;
    const pecas = pecasArmadura();
    const armSt = empilharArmaduras(pecas);
    const act = calcConj(conjAtivo());
    const armPen = armSt.penalidade || 0, penEsc = act.penSum || 0;
    const penFisica = armPen + penEsc; // Esquiva e deslocamento sofrem armadura + escudo(s)
    const cs = (regras.dano as any)?.centelhaNoSoak ?? 0;
    const vig = A('vigor'), dex = A('destreza');
    const defEsq = defesa({ destreza: dex, habilidade: SK('esquiva'), centelha: C }) - penFisica;
    // Bloqueio soma a Defesa das armas/escudos do conjunto EM USO. O escudo não penaliza o próprio Bloqueio.
    const defBlq = defesa({ destreza: dex, habilidade: SK('bloqueio'), centelha: C }) + (act.defSum || 0) - armPen;
    const pvv = pv(vig), en = energia({ vigor: vig, compostura: A('compostura'), raciocinio: A('raciocinio'), vontade: W, centelha: C }), mn = mana({ centelha: C, vontade: W, manipulacao: S.arte['manipulacao-mana'] || 0 });
    const fo = folego({ vigor: vig, resistencia: SK('resistencia'), vontade: W });
    const soc = defesaSocial({ compostura: A('compostura'), sociabilidade: SK('sociabilidade'), centelha: C });
    const men = defesaMental({ raciocinio: A('raciocinio'), integridade: integ, vontade: W, centelha: C });
    const soaks = SOAK_CATS.map((cat) => soakNatural(vig, cat) + C * cs + (armSt.soak[cat] || 0));
    const pArm = armPen ? ` − ${armPen} (Armadura)` : '';
    const pEsc = penEsc ? ` − ${penEsc} (Escudo)` : '';
    const defParts = [act.habil, act.inabil].filter((it: any) => it.def).map((it: any) => ` ${it.def >= 0 ? '+' : '−'} ${Math.abs(it.def)} (${it.nome})`).join('');
    const soakCalc = `Impacto ${soaks[0]} = Vigor ${vig} + Centelha ${C}${armSt.soak.impacto ? ` + ${armSt.soak.impacto} (armadura)` : ''} · Corte ${soaks[1]} e Perfuração ${soaks[2]} = Centelha ${C}${(armSt.soak.corte || armSt.soak.perfuracao) ? ' + armadura' : ''}${armSt.resistPerf ? ` · Resist. Perfuração Nível ${armSt.resistPerf}` : ''}`;
    el('derived').innerHTML =
      r('Pontos de Vida', pvv, `25 + Vigor ${vig}×3 = ${pvv}`) +
      r('Defesa (Esquiva)', defEsq, `(Destreza ${dex} + Esquiva ${SK('esquiva')})×2 + Centelha ${C}${pArm}${pEsc} = ${defEsq}`) +
      r('Defesa (Bloqueio)', defBlq, `(Destreza ${dex} + Bloqueio ${SK('bloqueio')})×2 + Centelha ${C}${defParts}${pArm} = ${defBlq}`) +
      r('Defesa Social', soc, `(Compostura ${A('compostura')} + Sociabilidade ${SK('sociabilidade')})×2 + Centelha ${C} = ${soc}`) +
      r('Defesa Mental', men, `Raciocínio ${A('raciocinio')} + Integridade ${integ} + Vontade ${W} + Centelha ${C} = ${men}`) +
      r('Absorção Imp/Cor/Perf', `${soaks.join(' / ')}${armSt.resistPerf ? ` · Nível ${armSt.resistPerf}` : ''}`, soakCalc) +
      r('Energia', en, `(Vigor ${vig} + Compostura ${A('compostura')} + Raciocínio ${A('raciocinio')} + Vontade ${W})÷2 + Centelha ${C}×2 = ${en}`, true) +
      r('Mana', mn, `Centelha ${C}×2 + Vontade ${W} = ${mn}`, true) +
      r('Fôlego', fo, `10 + Vigor ${vig}×5 + Resistência ${SK('resistencia')}×4 + Vontade ${W}×2 = ${fo} · recupera Vigor/Tick`, true) +
      r('Iniciativa', iniciativa({ raciocinio: A('raciocinio'), prontidao: SK('prontidao') }).str, `1d6 + Raciocínio ${A('raciocinio')} + Prontidão ${SK('prontidao')}`, true) +
      (() => { const dz = deslocamento({ forca: A('forca'), destreza: dex, atletismo: SK('atletismo'), centelha: C });
        const penMov = Math.floor(penFisica / 2);
        const mp = (v: number) => Math.max(0, v - penMov);
        const cmp = (v: number) => Math.max(0, v - penMov * 10);
        const ps = penMov ? ` − ½ penalidade (${penMov})` : '';
        return r('Deslocamento livre', `${mp(dz.normal)} m`, `(Destreza ${dex} + Atletismo ${SK('atletismo')}) ÷ 2${ps} = ${mp(dz.normal)} m na ação`, true) +
          r('Vel. de Arranque', `${mp(dz.arranque)} m/s`, `(Força ${A('forca')} + Atletismo ${SK('atletismo')}) ÷ 2 + Destreza ${dex} · Ticks 1–3${ps}`, true) +
          r('Vel. de Corrida', `${mp(dz.corrida)} m/s`, `Destreza ${dex} × 1,5 + Atletismo ${SK('atletismo')} · Tick 4+${ps}`, true) +
          r('Salto Vertical', `${cmp(dz.saltoVertical)} cm`, `Força ${A('forca')}×20 + Atletismo ${SK('atletismo')}×10 + Destreza ${dex}×4 + Centelha ${C}×50`, true) +
          r('Salto Horiz. Parado', `${mp(dz.saltoHorizontalParado)} m`, `(Força ${A('forca')} + Atletismo ${SK('atletismo')} + Centelha ${C}) ÷ 2${ps}`, true) +
          r('Salto Horiz. Correndo', `${mp(dz.saltoHorizontalCorrendo)} m`, `Vel. de Corrida + Atletismo ${SK('atletismo')} ÷ 2 + Centelha ${C}${ps}`, true); })();
  }
  function applyDerivCol() {
    el('derived').classList.toggle('collapsed', !!S.derivCol);
    el('deriv-toggle').textContent = S.derivCol ? 'Expandir' : 'Contrair';
  }
  function renderCombate() {
    const act = calcConj(conjAtivo());
    const w = act.atk, C = S.centelha || 0, armorPen = act.armorPen;
    const atk = `${act.dados}d6${act.bonus ? '+2' : ''}${act.flat ? ' ' + sgn(act.flat) : ''}`;
    const dano = act.versoes.map((v) => `${v.rot ? v.rot + ': ' : ''}${w.dado}d6${v.ap ? ' ' + sgn(v.ap) : ''}`).join(' · ');
    const modos = ((w.modos ?? [{ tipo: w.tipoDano, perf: w.pen, principal: true }]) as any[]).slice().sort((a, b) => ((MODO_ORDEM as any)[a.tipo] ?? 9) - ((MODO_ORDEM as any)[b.tipo] ?? 9));
    const modoStr = modos.map((m) => `${MODO_NOME[m.tipo as keyof typeof MODO_NOME]}${m.perf != null ? ` (N${m.perf})` : ''}${m.principal ? '' : ' *'}`).join(' · ');
    const temSec = modos.some((m) => !m.principal);
    const blk = defesa({ destreza: A('destreza'), habilidade: SK('bloqueio'), centelha: C }) + (act.defSum || 0) - armorPen;
    const nomeSet = `${act.habil.nome}${act.inabil.kind !== 'nada' ? ` + ${act.inabil.nome}` : ''}`;
    const escudos = [act.habil, act.inabil].filter((it: any) => it.kind === 'escudo');
    const pecas = pecasArmadura();
    el('combate').innerHTML =
      `<div class="cmb"><b>Conjunto em uso</b> — ${nomeSet}</div>` +
      `<div class="cmb"><b>Ataque</b> — ${w.nome}: rola <b>${atk}</b> · dano <b>${dano}</b> · Velocidade ${w.ticks} · Fôlego ${w.folego ?? 0}</div>` +
      `<div class="cmb"><b>Modos</b> — ${modoStr}${temSec ? ' <span class="muted">(* secundário: −2 acerto e −1d6 de dano)</span>' : ''}</div>` +
      `<div class="cmb muted">Custa ${w.folego ?? 0} de Fôlego por golpe; recupera Vigor/Tick fora dos ataques. Esforço: cada +1d6 dobra o Fôlego e +1 Velocidade.</div>` +
      (act.dist ? '' : `<div class="cmb"><b>Defesa por Bloqueio</b> — <b>${blk}</b> <span class="muted">(inclui a Defesa das armas do conjunto)</span></div>`) +
      (escudos.length
        ? `<div class="cmb muted">Projétil rápido: ${escudos.some((e: any) => e.habilProjetil) ? 'você tem escudo hábil, dá para Bloquear se estiver apto (consciente, braço livre, espaço para manobrar)' : 'escudo pequeno demais, não bloqueia projétil rápido, só Esquiva'}.</div>`
        : `<div class="cmb muted">Projétil rápido (flecha, virote, bala de funda): sem escudo hábil, só Esquiva.</div>`) +
      (w.notas ? `<div class="cmb muted">${w.notas}</div>` : '') +
      (pecas.length ? `<div class="cmb muted">Armadura: ${pecas.map((p: any) => p.nome).join(' + ')}.</div>` : '');
  }
  function renderForca() {
    const box = el('forca-arremesso'); if (!box) return;
    const F = (regras as any).forca; if (!F) { box.innerHTML = ''; return; }
    const forca = A('forca'), atl = SK('atletismo'), halt = S.skills2['halterofilismo'] || 0, arr = SK('arremesso');
    const clampFA = (v: number) => Math.max(2, Math.min(24, v));
    const fah = clampFA(2 * forca + atl + halt), faa = clampFA(2 * forca + atl + arr);
    const [leve, medio, maxKg] = F.levantamento[fah] as number[];
    const dmax = F.arremessoDistMax1kg[faa] as number;
    const lnM = Math.log(maxKg);
    const dist = (w: number) => w <= 1 ? dmax : w >= maxKg ? 0 : dmax * (1 - Math.log(w) / lnM);
    const peso = (d: number) => d <= 0 ? maxKg : d >= dmax ? 1 : Math.pow(maxKg, 1 - d / dmax);
    const r1 = (n: number) => n >= 100 ? String(Math.round(n)) : String(Math.round(n * 10) / 10);
    // gráfico Peso × Distância (eixo X = distância em m; eixo Y = peso em kg)
    const W = 580, H = 210, ml = 44, mr = 14, mt = 12, mb = 26;
    const pw = W - ml - mr, ph = H - mt - mb, xB = ml, yB = mt + ph, xR = ml + pw;
    const xpos = (d: number) => xB + (dmax > 0 ? d / dmax : 0) * pw;
    const ypos = (w: number) => yB - (maxKg > 0 ? w / maxKg : 0) * ph;
    const N = 80; const seq: string[] = [];
    for (let i = 0; i <= N; i++) { const d = dmax * i / N; seq.push(`${xpos(d).toFixed(1)},${ypos(peso(d)).toFixed(1)}`); }
    const pts = seq.join(' ');
    const area = `M${xB},${yB} L${seq.join(' L')} L${xR},${yB} Z`;
    let xticks = '';
    for (let i = 0; i <= 4; i++) { const d = dmax * i / 4; const x = xpos(d); xticks += `<line class="grid" x1="${x.toFixed(1)}" y1="${mt}" x2="${x.toFixed(1)}" y2="${yB}"/><text x="${x.toFixed(1)}" y="${yB + 15}" text-anchor="middle">${r1(d)}</text>`; }
    let yticks = '';
    [0, maxKg / 2, maxKg].forEach((w) => { const y = ypos(w); yticks += `<line class="grid" x1="${xB}" y1="${y.toFixed(1)}" x2="${xR}" y2="${y.toFixed(1)}"/><text x="${xB - 5}" y="${(y + 3).toFixed(1)}" text-anchor="end">${Math.round(w)}</text>`; });
    const svg = `<svg class="fa-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Peso por distância de arremesso"><text x="${xB - 6}" y="${mt + 8}" text-anchor="end" class="axlbl">kg</text><text x="${xR}" y="${yB + 15}" text-anchor="end" class="axlbl">m →</text>${yticks}${xticks}<path class="area" d="${area}"/><polyline class="curve" points="${pts}"/><line class="axis" x1="${xB}" y1="${mt}" x2="${xB}" y2="${yB}"/><line class="axis" x1="${xB}" y1="${yB}" x2="${xR}" y2="${yB}"/><rect class="fa-capture" x="${xB}" y="${mt}" width="${pw}" height="${ph}" fill="transparent"/><g class="fa-hover" style="display:none; pointer-events:none"><line class="fa-vline" y1="${mt}" y2="${yB}"/><circle class="fa-dot" r="4"/></g></svg>`;
    const tw = [1, 2, 5, 10, 20, 50, 100, 200, 500].filter((w) => w < maxKg);
    tw.push(maxKg);
    const rows = tw.map((w) => `<tr><td>${w}${w === maxKg ? ' <span class="muted">(máx)</span>' : ''}</td><td>${r1(dist(w))}</td></tr>`).join('');
    const table = `<table class="fa-tbl"><thead><tr><th>Peso (kg)</th><th>Arremesso (m)</th></tr></thead><tbody>${rows}</tbody></table>`;
    const head = `<div class="fa-head"><b>Levantamento</b> · FAH ${fah} = Força ${forca}×2 + Atletismo ${atl} + Halterofilismo ${halt}<div class="fa-tiers"><span>Leve <b>${leve} kg</b></span><span>Médio <b>${medio} kg</b></span><span>Máximo <b>${maxKg} kg</b></span></div><b>Arremesso</b> · FAA ${faa} = Força ${forca}×2 + Atletismo ${atl} + Arremesso ${arr} · <span class="muted">1 kg voa ${dmax} m; o peso máximo (${maxKg} kg), 0 m. Sem impulso nem giro.</span></div>`;
    box.innerHTML = `<div class="fa-wrap">${head}<div class="fa-row"><div class="fa-chartwrap">${svg}<div class="fa-tip" style="display:none"></div></div>${table}</div></div>`;
    // hover: mostra Peso × Distância sob o cursor
    const svgEl = box.querySelector('svg.fa-chart') as any;
    const tip = box.querySelector('.fa-tip') as any;
    const hov = box.querySelector('.fa-hover') as any;
    const vline = box.querySelector('.fa-vline') as any;
    const dot = box.querySelector('.fa-dot') as any;
    if (svgEl && tip && hov && vline && dot) {
      svgEl.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = svgEl.getBoundingClientRect();
        let d = ((e.clientX - rect.left) / rect.width * W - xB) / pw * dmax;
        d = Math.max(0, Math.min(dmax, d));
        const w = peso(d), cx = xpos(d), cy = ypos(w);
        hov.style.display = '';
        vline.setAttribute('x1', String(cx)); vline.setAttribute('x2', String(cx));
        dot.setAttribute('cx', String(cx)); dot.setAttribute('cy', String(cy));
        tip.style.display = '';
        tip.textContent = `${r1(w)} kg · ${r1(d)} m`;
        tip.style.left = (cx / W * rect.width) + 'px';
        tip.style.top = (cy / H * rect.height) + 'px';
      });
      svgEl.addEventListener('mouseleave', () => { hov.style.display = 'none'; tip.style.display = 'none'; });
    }
  }
  // Armaduras: as peças que o personagem POSSUI, cada uma com imagem e números próprios.
  // Vestir é o que faz a peça contar; várias podem estar vestidas ao mesmo tempo (vale a
  // maior Absorção de cada modo, e as penalidades somam).
  const pecaArm = (uid: string) => (S.equip.armaduras || []).find((p: any) => p.uid === uid) || null;
  function renderArmaduras() {
    const ro = !!opts.readOnly;
    const cards = (S.equip.armaduras || []).map((p: any) => {
      const base = ARMADURA[p.base]; if (!base) return '';
      const chave = `arm:${p.uid}`, a = armaduraComMod(base, p.mod);
      return `<div class="eq-peca arm${p.vestida ? ' vestida' : ''}${temMod(base, p.mod, CAMPOS_ARMADURA) ? ' ajustado' : ''}" data-arm-peca="${p.uid}">
        ${imgSlot(chave, p.img, 'armadura', ro, p.nome || base.nome, idDeArte(p))}
        <div class="eq-peca-corpo">
          ${ro ? `<div class="eq-peca-nome">${escapeHtml(p.nome || base.nome)}</div>`
               : `<input class="eq-nome-in" data-arm-nome="${p.uid}" value="${escapeHtml(p.nome || '')}" placeholder="${escapeHtml(base.nome)}" aria-label="Nome desta peça" />`}
          <div class="eq-nums" data-arm-nums="${p.uid}">
            <span class="eq-n"><b>Imp</b>${a.soak.impacto}</span>
            <span class="eq-n"><b>Cor</b>${a.soak.corte}</span>
            <span class="eq-n"><b>Perf</b>${a.soak.perfuracao}<i>N${a.resistPerf || 0}</i></span>
            <span class="eq-n pen"><b>Pen</b>${a.penalidade ? '−' + a.penalidade : '0'}</span>
          </div>
          ${ro ? '' : `<div class="eq-acoes">
            <button type="button" class="eq-ed" data-eqm-tog="${chave}" title="Ajustar os valores desta peça" aria-expanded="${modAberto.has(chave)}">✎ ajustar</button>
            <button type="button" class="eq-rm" data-arm-rm="${p.uid}" title="Descartar esta peça" aria-label="Excluir ${escapeHtml(p.nome || base.nome)}">Excluir</button>
          </div>`}
          <button type="button" class="eq-vestir${p.vestida ? ' on' : ''}" data-arm-vestir="${p.uid}"${ro ? ' disabled' : ''}>${p.vestida ? '✓ Vestida' : 'Vestir'}</button>
        </div>
        ${painelMod(chave, base, p.mod, CAMPOS_ARMADURA, ro)}
      </div>`;
    }).join('');
    const adicionar = ro ? '' : `<div class="eq-add">
      <label>Adicionar armadura
        <select data-arm-add><option value="">escolher do catálogo…</option>${ARMADURAS.filter((a) => a.id !== 'nenhuma').map((a) => `<option value="${a.id}">${a.nome}: ${statsArmadura(a)}</option>`).join('')}</select>
      </label>
    </div>`;
    const vazio = `<p class="muted eq-vazio">${ro ? 'Sem armaduras.' : 'Nenhuma armadura ainda: escolha uma no catálogo.'}</p>`;
    el('eq-armaduras').innerHTML = cards || vazio;
    el('eq-armaduras-add').innerHTML = adicionar;
    renderAbsorcao();
  }
  /** Painel de Absorção combinada: o efeito de vestir e tirar peças, ao lado das peças. */
  function renderAbsorcao() {
    const box = document.getElementById('eq-absorcao'); if (!box) return;
    const pecas = pecasArmadura();
    // empilharArmaduras devolve { soak: {impacto, corte, perfuracao}, resistPerf, penalidade }
    const st = empilharArmaduras(pecas);
    const nPerf = st.resistPerf || 0;
    const t = (rot: string, val: any, sub = '', cls = '') =>
      `<div class="abs-t${cls ? ' ' + cls : ''}"><span class="abs-l">${rot}${sub ? `<i>${sub}</i>` : ''}</span><span class="abs-v">${val}</span></div>`;
    box.innerHTML = `<h4>Absorção combinada</h4>` +
      t('Impacto', st.soak.impacto || 0) + t('Corte', st.soak.corte || 0) +
      t('Perfuração', st.soak.perfuracao || 0, nPerf ? `Nível N${nPerf}` : '') +
      t('Penalidade', st.penalidade ? '−' + st.penalidade : '0', '', 'pen') +
      `<p class="abs-nota muted">${pecas.length ? `${pecas.length} peça${pecas.length > 1 ? 's' : ''} vestida${pecas.length > 1 ? 's' : ''}: vale a maior Absorção de cada modo, as penalidades somam.` : 'Nada vestido.'}</p>`;
  }
  /** Atualiza só os números de uma peça de armadura (sem refazer o HTML). */
  function refreshArm(uid: string) {
    const p = pecaArm(uid); const base = p && ARMADURA[p.base]; if (!p || !base) return;
    const a = armaduraComMod(base, p.mod);
    const nums = el('eq-armaduras').querySelector(`[data-arm-nums="${uid}"]`);
    if (nums) nums.innerHTML = `<span class="eq-n"><b>Imp</b>${a.soak.impacto}</span><span class="eq-n"><b>Cor</b>${a.soak.corte}</span>` +
      `<span class="eq-n"><b>Perf</b>${a.soak.perfuracao}<i>N${a.resistPerf || 0}</i></span><span class="eq-n pen"><b>Pen</b>${a.penalidade ? '−' + a.penalidade : '0'}</span>`;
    const item = el('eq-armaduras').querySelector(`[data-arm-peca="${uid}"]`);
    if (item) item.classList.toggle('ajustado', temMod(base, p.mod, CAMPOS_ARMADURA));
    renderAbsorcao();
  }
  function populateEquip() {
    renderArsenal();
    renderConjuntos();
    renderArmaduras();
    renderBolsas();
  }
  /** Cada bolsa é uma tabela Item / Peso / Preço, com linhas que se acrescentam e removem. */
  function renderBolsas() {
    const ro = !!opts.readOnly, dis = ro ? ' disabled' : '';
    el('eq-bolsas').innerHTML = (S.bolsas || []).map((b: any, i: number) => {
      const linhas = (b.itens || []).map((l: any, j: number) => `<tr>
        <td><input value="${escapeHtml(l.item)}" data-bolsa="${i}:${j}:item" placeholder="—" aria-label="Item"${dis} /></td>
        <td><input value="${escapeHtml(l.peso)}" data-bolsa="${i}:${j}:peso" inputmode="decimal" aria-label="Peso"${dis} /></td>
        <td><input value="${escapeHtml(l.preco)}" data-bolsa="${i}:${j}:preco" inputmode="decimal" aria-label="Preço"${dis} /></td>
        ${ro ? '' : `<td class="bl-x"><button type="button" data-bolsa-rm="${i}:${j}" title="Remover esta linha" aria-label="Remover a linha ${j + 1}">×</button></td>`}
      </tr>`).join('');
      return `<div class="bolsa">
        <input class="bolsa-nome" data-bolsa-nome="${i}" value="${escapeHtml(b.nome)}" aria-label="Nome do campo de equipamento"${dis} />
        <table class="bolsa-tbl">
          <thead><tr><th>Item</th><th>Peso</th><th>Preço</th>${ro ? '' : '<th><span class="sr-only">Remover</span></th>'}</tr></thead>
          <tbody>${linhas}</tbody>
        </table>
        ${ro ? '' : `<button type="button" class="bolsa-add" data-bolsa-add="${i}">+ linha</button>`}
      </div>`;
    }).join('');
  }
  function recompute() {
    let xa = 0, xs = 0, xsp = 0, xv = 0, xw = 0, xap = 0, xc = 0, x2 = 0, xt = 0, xar = 0, xef = 0;
    (ATTRS_D as any[]).forEach((a) => (xa += custoPontos('atributo', undefined, S.attrs[a.id] ?? 1)));
    (HAB_D as any[]).filter((h) => !h.secundaria).forEach((h) => { xs += custoPontos('habilidadePrimaria', undefined, S.skills[h.id] || 0); xsp += specCostSum(S.spec[h.id]); });
    ['esquiva', 'bloqueio', 'social', 'mental'].forEach((k) => ((S.defSpec?.[k] || []) as any[]).forEach((e) => (xsp += triCost(e.v || 0))));
    (VIRT_D as any[]).forEach((v) => (xv += custoPontos('virtude', undefined, S.virtues[v.id] ?? 1)));
    xw = custoPontos('vontade', undefined, S.willpower ?? 0);
    xap = custoPontos('aparencia', undefined, S.aparencia ?? 0);
    xc = custoPontos('centelha', undefined, S.centelha || 0);   // grátis: sempre 0, mantido p/ a barra
    SECONDARY.forEach(([n]) => { const k = slug(n); x2 += custoPontos('habilidadeSecundaria', undefined, S.skills2[k] || 0) + specCostSum(S.spec2[k], true); });
    Object.keys(S.tech).forEach((id) => { if (S.tech[id] && TECNIV[id]) xt += custoTecnica(TECNIV[id]); });
    (ARTE_D as any[]).forEach((a) => (xar += custoArte(S.arte[a.id] || 0)));
    (EFEITO_D as any[]).forEach((e) => { if (S.efeito[e.id]) xef += custoEfeito(e.nivel); });
    const xr = RACA[S.raca]?.custo || 0;
    const total = xa + xs + xsp + xv + xw + xap + xc + x2 + xt + xar + xef + xr;
    el('xpSpent').textContent = String(total);
    const rem = (S.budget || 0) - total, re = el('xpRem'); re.textContent = String(rem); re.className = 'rem ' + (rem < 0 ? 'neg' : 'ok');
    el('xpBreak').innerHTML = `Atrib ${xa} · Habilidades ${xs + xsp} · Virtudes ${xv} · Vontade ${xw} · Aparência ${xap}` + (xc ? ` · Centelha ${xc}` : '') + (x2 ? ` · Secund. ${x2}` : '') + (xt ? ` · Proezas ${xt}` : '') + (xar ? ` · Artes ${xar}` : '') + (xef ? ` · Efeitos ${xef}` : '') + (xr ? ` · Raça ${xr}` : '');
    renderConjuntos(); renderDerived(); renderCombate(); renderForca(); save();
  }

  // ---- interações ----
  // pisos vindos de regras.json (Vontade e Aparência desceram de 1 para 0)
  const floorOf: Record<string, number> = {
    attr: pisoXp('atributo'), skill: pisoXp('habilidadePrimaria'), skill2: pisoXp('habilidadeSecundaria'),
    virtue: pisoXp('virtude'), centelha: pisoXp('centelha'), willpower: pisoXp('vontade'),
    aparencia: pisoXp('aparencia'), arte2: pisoXp('arte'),
  };
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
    else if (kind === 'skill') { S.skills[key] = nv; S.spec[key] = clampSpecs(S.spec[key], nv); renderSkills(); }
    else if (kind === 'skill2') { S.skills2[key] = nv; S.spec2[key] = clampSpecs(S.spec2[key], nv); renderSecondary(); }
    else if (kind === 'virtue') S.virtues[key] = nv;
    else if (kind === 'centelha') { S.centelha = nv; renderCaminhos(); renderArtes(); }
    else if (kind === 'willpower') S.willpower = nv;
    else if (kind === 'aparencia') S.aparencia = nv;
    else if (kind === 'arte2') { S.arte[key] = nv; renderArtes(); }
    if (['attr', 'virtue', 'centelha', 'willpower', 'aparencia'].includes(kind)) refreshDots(kind, key);
    if (kind === 'aparencia') { const m = aparenciaMod(apEfetiva(nv)); const sp = document.querySelector('.apmod'); if (sp) sp.textContent = (m >= 0 ? '+' : '') + m; }
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSpecPop(); });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-specpop-close]')) { closeSpecPop(); return; }
    if (specPopFor && !t.closest('.specpop') && !t.closest('.spec .sq')) closeSpecPop();
    const nm = t.closest<HTMLElement>('.trow .nm');
    if (nm) { openTraitModal(nm); return; }
    const dot = t.closest<HTMLElement>('.dots .dot');
    if (dot) { if (opts.readOnly || dot.classList.contains('cap')) return; const s = dot.parentElement as HTMLElement; setDot(s.dataset.kind!, s.dataset.key!, +dot.dataset.d!); return; }
    const rb = t.closest<HTMLElement>('.rollv');
    if (rb) { const [k, key] = rb.dataset.roll!.split(':'); const rd = (n: string) => document.querySelector<HTMLInputElement>(`[data-rd="${n}"]`);
      if (k === 'attr') { const a = rd('atr'); if (a) { a.value = String(S.attrs[key] || 0); a.dispatchEvent(new Event('input')); } }
      else { const hb = rd('hab'), es = rd('esp'); if (hb) hb.value = String(S.skills[key] || 0); if (es) es.value = '0'; hb?.dispatchEvent(new Event('input')); }
      document.querySelector('.rolador')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    // especialidades: o botão abre o modal (scope 'p' primária, 's' secundária)
    const spBtn = t.closest<HTMLElement>('[data-specbtn]');
    if (spBtn && !opts.readOnly) { const [scope, key] = spBtn.dataset.specbtn!.split(':'); openSpecPop(scope, key); return; }
    const dsAdd = t.closest<HTMLElement>('[data-defspec-add]');
    if (dsAdd && !opts.readOnly) {
      const key = dsAdd.dataset.defspecAdd!;
      void (async () => {
        const r = await uiFormulario('Especialidade situacional', [
          { nome: 's', rotulo: 'Situação', placeholder: 'contra um grupo, vs sedução, na floresta…', obrigatorio: true },
          { nome: 'v', rotulo: 'Bônus', valor: 2, tipo: 'numero', min: 1, max: 6, dica: 'De 1 a 6, vale só quando a situação acontece.' },
        ], { ok: 'Adicionar' });
        if (!r) return;
        const s = r.s.trim();
        const v = Math.max(0, Math.min(6, parseInt(r.v, 10) || 0));
        if (!s || !v) return;
        (S.defSpec[key] ||= []).push({ s, v }); recompute();
      })();
      return;
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
    const ef = t.closest<HTMLInputElement>('[data-efeito]');
    if (ef) { if (opts.readOnly) return; const id = ef.dataset.efeito!; S.efeito[id] = !S.efeito[id]; renderEfeitos(); recompute(); return; }
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
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] = Math.min(S.skills[h.id] || 0, capFor('skill', h.id)); S.spec[h.id] = clampSpecs(S.spec[h.id], S.skills[h.id]); });
    SECONDARY.forEach(([n]) => { const k = slug(n); S.skills2[k] = Math.min(S.skills2[k] || 0, capFor('skill2', k)); S.spec2[k] = clampSpecs(S.spec2[k], S.skills2[k]); });
    S.centelha = Math.min(S.centelha || 0, capFor('centelha'));
  }
  function renderRaca() {
    const sel = el('raca-sel') as HTMLSelectElement;
    if (!sel.options.length) sel.innerHTML = (RACA_D as any[]).map((r) => `<option value="${r.id}">${r.nome}</option>`).join('');
    sel.value = S.raca; sel.disabled = !!opts.readOnly;
    const r = RACA[S.raca] || {}; const AN: Record<string, string> = Object.fromEntries((ATTRS_D as any[]).map((a) => [a.id, a.nome]));
    const mods = Object.entries(r.atributos || {}).map(([k, v]) => `${(v as number) > 0 ? '+' : ''}${v} ${AN[k] || k} <small>(máx ${6 + (v as number)})</small>`);
    if (r.aparenciaMod) mods.push(`Aparência ${r.aparenciaMod > 0 ? '+' : ''}${r.aparenciaMod}`);
    const custo = r.custo ? `<b>${r.custo} XP</b> · ` : '';
    const modStr = mods.length ? `<span class="mods">${mods.join(' · ')}</span>. ` : '';
    el('raca-info').innerHTML = r.descricao ? `${custo}${modStr}${r.descricao}${(r.tracos || []).length ? ' <em>' + (r.tracos as string[]).join(' ') + '</em>' : ''}` : '';
  }
  function setModo(m: string) { S.modo = m; if (m === 'criacao') clampToMode(); renderAll(); }
  function renderAll() { syncInputs(); renderRaca(); markModo(); renderAttrs(); renderPower(); renderSkills(); renderSecondary(); renderCaminhos(); renderArtes(); populateEquip(); recompute(); applyDerivCol(); applySecCol(); }

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
    const r = new FileReader(); r.onload = () => { try { S = JSON.parse(String(r.result)); normalize(); if (opts.budgetValor != null) S.budget = opts.budgetValor; renderAll(); } catch { void uiErro('Arquivo JSON inválido.'); } }; r.readAsText(f);
  });
  el('f-print').addEventListener('click', () => window.print());
  el('deriv-toggle').addEventListener('click', () => { S.derivCol = !S.derivCol; applyDerivCol(); save(); });
  let camAllOpen = false;
  el('cam-all').addEventListener('click', () => { camAllOpen = !camAllOpen; CAM_ORDER.forEach((c) => (OPEN.cam[c] = camAllOpen)); renderCaminhos(); el('cam-all').textContent = camAllOpen ? 'Recolher todos' : 'Expandir todos'; });
  // Seções recolhíveis (Habilidades, Secundárias, Proezas & Técnicas, Arcano — Artes). Padrão: abertas.
  function applySecCol() {
    if (!S) return;
    document.querySelectorAll<HTMLElement>('h2.barh-tog').forEach((h) => {
      const sec = h.dataset.sec!; const body = document.getElementById('sec-' + sec);
      const col = !!(S.secCol && S.secCol[sec]);
      if (body) body.classList.toggle('sec-hidden', col);
      const car = h.querySelector('.sec-caret'); if (car) car.textContent = col ? '▸' : '▾';
    });
  }
  document.querySelectorAll<HTMLElement>('h2.barh-tog').forEach((h) => h.addEventListener('click', () => {
    const sec = h.dataset.sec!; (S.secCol ||= {}); S.secCol[sec] = !S.secCol[sec]; applySecCol(); if (!opts.readOnly) save();
  }));
  // ---- Arsenal: adicionar, marcar o uso, descartar, improvisado ----
  const redesenhaArmas = () => { renderArsenal(); renderConjuntos(); renderDerived(); renderCombate(); save(); };
  el('eq-arsenal-add').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const add = (e.target as HTMLElement).closest<HTMLSelectElement>('select[data-ars-add]');
    if (!add || !add.value) return;
    (S.arsenal ||= []).push(add.value === 'c'
      ? { uid: novoUid(), ref: 'c', nome: '', dado: 1, danoBonus: 0, acerto: -2 }
      : { uid: novoUid(), ref: add.value });
    add.value = ''; redesenhaArmas();
  });
  el('eq-arsenal').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const alvo = e.target as HTMLElement;
    const uso = alvo.closest<HTMLInputElement>('input[data-uso]');
    if (uso) {
      const [uid, papel] = uso.dataset.uso!.split(':');
      marcarUso(uid, papel as any); redesenhaArmas(); return;
    }
    const imp = alvo.closest<HTMLSelectElement>('select[data-ars-improv]');
    if (imp) {
      const [uid, campo] = (imp.dataset.arsImprov || '').split(':');
      const p = pecaArsenal(uid); if (!p) return;
      p[campo] = Number(imp.value); sincronizarSlots(); redesenhaArmas();
    }
  });
  el('eq-arsenal').addEventListener('click', async (e) => {
    if (opts.readOnly) return;
    const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-ars-rm]');
    if (!rm) return;
    const uid = rm.dataset.arsRm!, p = pecaArsenal(uid); if (!p) return;
    const papel = papelDaPeca(uid);
    const ok = await uiConfirmar(
      `Descartar ${nomePeca(p)}?` + (papel !== 'nada' ? ' Ela está empunhada, e a mão fica livre.' : ''),
      { titulo: 'Descartar peça', ok: 'Descartar', perigo: true },
    );
    if (!ok) return;
    marcarUso(uid, 'nada');
    S.arsenal = S.arsenal.filter((x: any) => x.uid !== uid);
    sincronizarSlots(); redesenhaArmas();
  });
  el('eq-arsenal').addEventListener('input', (e) => {
    if (opts.readOnly) return;
    const nm = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-ars-nome]');
    if (nm) {
      const p = pecaArsenal(nm.dataset.arsNome!); if (!p) return;
      p.nome = nm.value; sincronizarSlots();
      const card = nm.closest('.eq-peca'); const t = card?.querySelector('.eq-peca-nome');
      if (t) t.textContent = nomePeca(p);
      renderConjuntos(); renderCombate(); save(); return;
    }
    const imp = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-ars-improv]');
    if (imp) {
      const [uid, campo] = (imp.dataset.arsImprov || '').split(':');
      const p = pecaArsenal(uid); if (!p) return;
      p[campo] = Number(imp.value); sincronizarSlots();
      renderConjuntos(); renderDerived(); renderCombate(); save();
    }
  });
  // ---- Imagem das peças (arsenal e armaduras usam o mesmo par de eventos) ----
  // A chave do espaço é "ars:<uid>" ou "arm:<uid>", a mesma do painel de ajuste.
  const pecaPorChave = (chave: string) => {
    const [tipo, uid] = chave.split(':');
    return tipo === 'arm' ? pecaArm(uid) : pecaArsenal(uid);
  };
  async function trocarImagem(chave: string, file: File) {
    const p = pecaPorChave(chave); if (!p) return;
    const { subirImagemItem } = await import('./imagens-item');
    const r = await subirImagemItem(file, p.uid);
    if (r.erro) { void uiErro(r.erro); return; }
    p.img = r.url;
    renderArsenal(); renderArmaduras(); renderConjuntos(); save();
  }
  async function tirarImagem(chave: string) {
    const p = pecaPorChave(chave); if (!p || !p.img) return;
    const url = p.img; p.img = undefined;
    renderArsenal(); renderArmaduras(); renderConjuntos(); save();
    const { apagarImagemItem } = await import('./imagens-item');
    void apagarImagemItem(url);
  }
  (['eq-arsenal', 'eq-armaduras'] as const).forEach((id) => {
    el(id).addEventListener('change', (e) => {
      if (opts.readOnly) return;
      const inp = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-eq-img]');
      const f = inp?.files?.[0];
      if (inp && f) { void trocarImagem(inp.dataset.eqImg!, f); inp.value = ''; }
    });
    el(id).addEventListener('click', (e) => {
      if (opts.readOnly) return;
      const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-eq-img-rm]');
      if (!rm) return;
      e.preventDefault(); e.stopPropagation();   // o botão vive dentro do <label> do arquivo
      void tirarImagem(rm.dataset.eqImgRm!);
    });
  });

  el('eq-conjuntos').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('select[data-conj-sel]');
    if (sel) {
      const [i, hand] = sel.dataset.conjSel!.split(':'); const cj = S.conjuntos[+i]; const val = sel.value;
      // o seletor entrega uma referência do CATÁLOGO (ou "nada")
      if (val === 'nada') cj[hand] = { ref: hand === 'habil' ? 'a:desarmado' : 'nada' };
      else {
        const p = pecaPara(val);
        const outra = hand === 'habil' ? 'inabil' : 'habil';
        // uma peça é um objeto só: se já estava na outra mão deste conjunto, sai de lá
        if (cj[outra]?.uid === p.uid) cj[outra] = { ref: outra === 'habil' ? 'a:desarmado' : 'nada' };
        cj[hand] = { uid: p.uid, ref: p.ref };
        const w = p.ref.startsWith('a:') ? ARMA[p.ref.slice(2)] : null;
        // arma de duas mãos ocupa as duas: sobe para a hábil e libera a inábil
        if (w && w.maos === 2) { if (hand === 'inabil') cj.habil = { uid: p.uid, ref: p.ref }; cj.inabil = { ref: 'nada' }; }
      }
      limparArsenal(); sincronizarSlots(); renderConjuntos(); renderDerived(); renderCombate(); save(); return;
    }
    const uso = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-conj-uso]');
    if (uso) { const i = +uso.dataset.conjUso!; S.conjuntos.forEach((c: any, j: number) => (c.ativo = j === i)); renderConjuntos(); renderDerived(); renderCombate(); save(); }
  });
  // ---- Armaduras: adicionar, descartar, renomear, vestir ----
  el('eq-armaduras-add').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const add = (e.target as HTMLElement).closest<HTMLSelectElement>('select[data-arm-add]');
    if (!add || !add.value) return;
    (S.equip.armaduras ||= []).push({ uid: novoUid(), base: add.value, vestida: true });
    add.value = ''; renderArmaduras(); renderDerived(); renderCombate(); save();
  });
  el('eq-armaduras').addEventListener('input', (e) => {
    if (opts.readOnly) return;
    const nm = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-arm-nome]');
    if (!nm) return;
    const p = pecaArm(nm.dataset.armNome!); if (!p) return;
    p.nome = nm.value.trim() || undefined; save();
  });
  el('eq-armaduras').addEventListener('click', async (e) => {
    if (opts.readOnly) return;
    const vest = (e.target as HTMLElement).closest<HTMLElement>('[data-arm-vestir]');
    if (vest) {
      const p = pecaArm(vest.dataset.armVestir!); if (!p) return;
      p.vestida = !p.vestida;
      renderArmaduras(); renderDerived(); renderCombate(); save(); return;
    }
    const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-arm-rm]');
    if (!rm) return;
    const p = pecaArm(rm.dataset.armRm!); if (!p) return;
    const ok = await uiConfirmar(
      `Descartar ${p.nome || ARMADURA[p.base]?.nome || 'esta armadura'}?`,
      { titulo: 'Descartar peça', ok: 'Descartar', perigo: true },
    );
    if (!ok) return;
    S.equip.armaduras = S.equip.armaduras.filter((x: any) => x.uid !== p.uid);
    renderArmaduras(); renderDerived(); renderCombate(); save();
  });
  // ---- Ajuste de peça: os valores do catálogo, editáveis por peça POSSUÍDA ----
  // A chave é "arm:<uid>" (peça de armadura) ou "ars:<uid>" (arma ou escudo do arsenal).
  // O ajuste mora na peça, não no slot da mão: assim a mesma espada em dois conjuntos
  // carrega os mesmos números, que é o ponto de a peça ter identidade própria.
  function alvoMod(chave: string) {
    const [a, uid] = chave.split(':');
    const guarda = (p: any, base: any, campos: CampoEquip[], redesenha: () => void) => ({
      base, campos,
      mod: () => p.mod,
      escreve: (k: string, v: number | null) => {
        const m = (p.mod ||= {});
        if (v == null) delete m[k]; else m[k] = v;
        if (!Object.keys(m).length) delete p.mod;
        sincronizarSlots();
      },
      limpa: () => { delete p.mod; sincronizarSlots(); },
      redesenha,
    });
    if (a === 'arm') {
      const p = pecaArm(uid); const base = p && ARMADURA[p.base]; if (!p || !base) return null;
      return guarda(p, base, CAMPOS_ARMADURA, () => refreshArm(uid));
    }
    if (a === 'ars') {
      const p = pecaArsenal(uid); if (!p) return null;
      const it = itemDe(p);
      if (it.kind !== 'arma' && it.kind !== 'escudo') return null;
      return guarda(p, it.base, camposItem(it), () => { renderArsenal(); renderConjuntos(); });
    }
    return null;
  }
  function ligarAjustes(box: HTMLElement) {
    box.addEventListener('click', (e) => {
      const tog = (e.target as HTMLElement).closest<HTMLElement>('[data-eqm-tog]');
      if (tog) {
        const chave = tog.dataset.eqmTog!, abrir = !modAberto.has(chave);
        if (abrir) modAberto.add(chave); else modAberto.delete(chave);
        const pan = box.querySelector<HTMLElement>(`[data-eq-pan="${chave}"]`);
        if (pan) pan.hidden = !abrir;
        tog.setAttribute('aria-expanded', String(abrir));
        return;
      }
      if (opts.readOnly) return;
      const rst = (e.target as HTMLElement).closest<HTMLElement>('[data-eqm-reset]');
      if (rst) {
        const alvo = alvoMod(rst.dataset.eqmReset!); if (!alvo) return;
        alvo.limpa(); populateEquip(); renderDerived(); renderCombate(); save();
      }
    });
    box.addEventListener('input', (e) => {
      if (opts.readOnly) return;
      const inp = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-eqm]');
      if (!inp) return;
      const partes = inp.dataset.eqm!.split(':'), k = partes.pop()!;
      const alvo = alvoMod(partes.join(':')); if (!alvo) return;
      const campo = alvo.campos.find((c) => c.k === k); if (!campo) return;
      const bruto = inp.value.trim();
      alvo.escreve(k, bruto === '' ? null : Math.max(campo.min, Math.min(campo.max, Math.round(Number(bruto) || 0))));
      const lab = inp.closest('.eqm-c');
      if (lab) lab.classList.toggle('dif', valorCampo(alvo.base, alvo.mod(), campo) !== baseCampo(alvo.base, campo));
      alvo.redesenha(); renderDerived(); renderCombate(); save();
    });
  }
  ligarAjustes(el('eq-arsenal'));
  ligarAjustes(el('eq-armaduras'));
  el('eq-conjuntos').addEventListener('click', (e) => {
    if (opts.readOnly) return;
    const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-conj-rm]');
    if (rm) { S.conjuntos.splice(+rm.dataset.conjRm!, 1); if (!S.conjuntos.some((c: any) => c.ativo)) S.conjuntos[0].ativo = true; renderConjuntos(); renderDerived(); renderCombate(); save(); }
  });
  el('add-conjunto').addEventListener('click', () => { if (opts.readOnly) return; S.conjuntos.push({ habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' }, ativo: false }); renderConjuntos(); save(); });
  // popover de cálculo ao passar o mouse nos Derivados
  let calcPop: HTMLElement | null = null;
  document.addEventListener('mouseover', (e) => {
    const d = (e.target as HTMLElement).closest<HTMLElement>('[data-calc]'); if (!d) return;
    const txt = d.getAttribute('data-calc'); if (!txt) return;
    if (!calcPop) { calcPop = document.createElement('div'); calcPop.className = 'calcpop'; document.body.appendChild(calcPop); }
    calcPop.textContent = txt; calcPop.style.display = 'block';
    const r = d.getBoundingClientRect();
    calcPop.style.left = Math.max(8, Math.min(window.scrollX + r.left - 120, window.scrollX + document.documentElement.clientWidth - 288)) + 'px';
    calcPop.style.top = (window.scrollY + r.bottom + 4) + 'px';
  });
  document.addEventListener('mouseout', (e) => { if ((e.target as HTMLElement).closest('[data-calc]') && calcPop) calcPop.style.display = 'none'; });
  el('eq-bolsas').addEventListener('input', (e) => {
    if (opts.readOnly) return;
    const t = e.target as HTMLInputElement;
    const ni = t.getAttribute('data-bolsa-nome');
    if (ni != null) { S.bolsas[+ni].nome = t.value; save(); return; }
    const cel = t.getAttribute('data-bolsa');
    if (cel != null) {
      const [i, j, campo] = cel.split(':');
      const linha = S.bolsas?.[+i]?.itens?.[+j]; if (!linha) return;
      linha[campo] = t.value; save();   // sem redesenhar: o campo em edição não pode perder o foco
    }
  });
  el('eq-bolsas').addEventListener('click', (e) => {
    if (opts.readOnly) return;
    const alvo = e.target as HTMLElement;
    const add = alvo.closest<HTMLElement>('[data-bolsa-add]');
    if (add) { (S.bolsas[+add.dataset.bolsaAdd!].itens ||= []).push(linhaBolsa()); renderBolsas(); save(); return; }
    const rm = alvo.closest<HTMLElement>('[data-bolsa-rm]');
    if (rm) {
      const [i, j] = rm.dataset.bolsaRm!.split(':').map(Number);
      const b = S.bolsas?.[i]; if (!b) return;
      b.itens.splice(j, 1);
      if (!b.itens.length) b.itens.push(linhaBolsa());   // a tabela nunca fica sem nenhuma linha
      renderBolsas(); save();
    }
  });
  el('raca-sel').addEventListener('change', (e) => { if (opts.readOnly) return; S.raca = (e.target as HTMLSelectElement).value; (ATTRS_D as any[]).forEach((a) => { const c = capFor('attr', a.id); if ((S.attrs[a.id] || 1) > c) S.attrs[a.id] = c; }); renderAttrs(); renderPower(); renderRaca(); recompute(); save(); });
  el('f-reset').addEventListener('click', async () => { if (opts.readOnly) return; if (await uiConfirmar('Limpar a ficha? Tudo o que está preenchido se perde.', { titulo: 'Limpar ficha', ok: 'Limpar', perigo: true })) { opts.aoResetar?.(); fresh(); if (opts.budgetValor != null) S.budget = opts.budgetValor; renderAll(); } });
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
