// Motor da ficha interativa (extraído de ficha.astro para ser reaproveitado).
// Renderiza bolinhas/cards/derivados no esqueleto (FichaSkeleton.astro) e calcula XP ao vivo.
// A persistência e o orçamento são configuráveis via opts, para servir tanto a /ficha
// (localStorage) quanto a /personagem (Supabase, com XP definido pelo mestre).
import { custoPontos, custoTecnica, custoArte, custoEfeito, custoEspecialidade, pisoXp, pv, defesa, defesaMental, defesaSocial, energia, mana, folego, iniciativa, deslocamento, ataqueCentelha, aparenciaMod, empilharArmaduras, soakNatural, MODO_NOME, MODO_ORDEM, SOAK_CATS, regras } from './calc';
import ATTRS_D from '../data/atributos.json';
import HAB_D from '../data/habilidades.json';
import SEC_D from '../data/habilidades-secundarias.json';
import VIRT_D from '../data/virtudes.json';
import CAM_D from '../data/caminhos.json';
import TEC_D from '../data/tecnicas.json';
import ARTE_D from '../data/artes.json';
import EFEITO_D from '../data/efeitos.json';
import RACA_D from '../data/racas.json';
// a mesma formatação de parâmetros do capítulo XV, para a ficha não inventar outra
import { ordemPar, valorPar, formaDe, rank, PAR_FORMA } from './artes-fmt';
import { sparkSVG } from './centelha-spark';
import { url } from './site';
import {
  ARMA, ARMADURA, ESCUDO, ARMAS, ARMADURAS, ESCUDOS, ID_ARMADURA_LIVRE, baseArmadura,
  CAMPOS_ARMA, CAMPOS_ARMADURA, CAMPOS_ESCUDO, type CampoEquip,
  armaComMod, armaduraComMod, escudoComMod, armadurasDe, baseCampo, valorCampo, temMod,
  danoStr, statsArma, statsArmadura, statsEscudo, sinalNum,
} from './equip';
import { uiConfirmar, uiErro, uiEscolher, uiFormulario, uiPainel } from './ui-dialog';

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
  // A régua da Aparência vai de 0 a 12, e o 0 é o piso grátis (curva −5). O clamp antigo
  // era [1,12] com `v || 1`, então quem não investia nada aparecia como 1 e nunca via o −5.
  const apEfetiva = (v: number) => Math.max(0, Math.min(12, (v ?? 0) + racApMod()));
  const el = (id: string) => document.getElementById(id)!;
  const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const ATTR_GRP: Record<string, string> = { fisico: 'Físicos', social: 'Sociais', mental: 'Mentais' };
  const HAB_GRP: Record<string, string> = { combate: 'Combate', fisica: 'Físicas', social: 'Sociais', saber: 'Saber', tecnica: 'Técnicas' };
  // O catálogo das Secundárias vive em habilidades-secundarias.json, junto com o resto dos
  // dados: é a mesma fonte que o capítulo II lista e que os hovercards leem. O `id` de cada
  // uma é o slug do nome, que é a chave usada em S.skills2 desde sempre.
  const SEC_GRP: Record<string, string> = {
    corpo: 'Corpo', sociais: 'Sociais', conhecimento: 'Conhecimento', oficio: 'Ofício',
    expressao: 'Expressão', subterfugio: 'Subterfúgio', interior: 'Interior',
  };
  const SECONDARY: [string, string][] = (SEC_D as any[]).map((s) => [s.nome, SEC_GRP[s.grupo]]);

  // Três vagas em branco no fim das Secundárias, para o que o catálogo não previu. A regra já
  // diz que as Secundárias são ilimitadas e criadas conforme a história pede; sem estas vagas
  // a ficha era a única parte do sistema que não deixava. A chave é fixa (livre-1 a livre-3) e
  // o nome digitado vive à parte, em S.livreNome, para não virar chave e quebrar ao ser trocado.
  const LIVRES = ['livre-1', 'livre-2', 'livre-3'];
  const ehSecLivre = (k: string) => LIVRES.includes(k);
  const nomeLivre = (k: string) => (S?.livreNome?.[k] || '').trim();

  const SEC_NOME: Record<string, string> = Object.fromEntries((SEC_D as any[]).map((s) => [s.id, s.nome]));
  const SEC_DESC: Record<string, string> = Object.fromEntries((SEC_D as any[]).map((s) => [s.id, s.descricao]));
  const SEC_NIV: Record<string, any[]> = Object.fromEntries((SEC_D as any[]).map((s) => [s.id, s.niveis]));
  const TRACO_DESC: Record<string, string> = {
    centelha: 'O nível de poder pessoal, do mortal ao semideus. Destrava os níveis das Proezas e dimensiona Energia e Mana.',
    willpower: 'Reserva de determinação (0 a 12, piso 0, custo ×2 por nível). Gasta-se para potencializar ações, resistir a medo e manipulação, e conjurar.',
    aparencia: 'Traço próprio (0 a 12, piso 0, custo ×2 por nível). Modificador direcional na jogada social: ajuda alinhado (seduzir, impressionar) e atrapalha invertido (intimidar). A Compostura mascara parte dele.',
  };
  /**
   * Todo traço da ficha abre o MESMO modal, com a mesma informação e na mesma ordem:
   * tipo · nome · descrição em um parágrafo · régua de níveis (número, rótulo, texto) ·
   * link para o capítulo onde ele mora. Antes cada tipo entregava um formato diferente, e as
   * 92 perícias caíam todas na régua genérica; agora cada uma traz a sua, vinda do dado.
   */
  function openTraitModal(nm: HTMLElement) {
    const dots = nm.closest('.trow')?.querySelector('.dots') as HTMLElement | null; if (!dots) return;
    const k = dots.dataset.kind!, key = dots.dataset.key!;
    const escala = (n: string) => (regras as any)[n];
    let p: any = null;
    if (k === 'attr') { const a = (ATTRS_D as any[]).find((x) => x.id === key); p = { tipo: 'atributo', nome: a.nome, descricao: a.descricao, niveis: a.niveis, url: url('regras/atributos') }; }
    else if (k === 'skill') { const h = (HAB_D as any[]).find((x) => x.id === key); p = { tipo: 'habilidade', nome: h.nome, descricao: h.descricao, niveis: h.niveis || escala('escalaHabilidade'), url: url('regras/habilidades') }; }
    else if (k === 'skill2' && ehSecLivre(key)) { p = { tipo: 'habilidade secundária', nome: nomeLivre(key) || 'Secundária livre', descricao: 'Uma Secundária criada nesta mesa, fora do catálogo sugerido. Vale exatamente como qualquer outra: custa metade de uma primária, aceita Especialidade e segue a mesma escala de competência.', niveis: escala('escalaHabilidade'), url: url('regras/habilidades-secundarias') }; }
    else if (k === 'skill2') { p = { tipo: 'habilidade secundária', nome: SEC_NOME[key] || key, descricao: SEC_DESC[key] || 'Conhecimento ou ofício específico, de custo reduzido. Segue a mesma escala de competência das primárias.', niveis: SEC_NIV[key] || escala('escalaHabilidade'), url: url('regras/habilidades-secundarias') + '#sec-' + key }; }
    else if (k === 'virtue') { const v = (VIRT_D as any[]).find((x) => x.id === key); p = { tipo: 'virtude', nome: v.nome, descricao: `${v.descricao} Resiste ${v.resiste}.`, niveis: v.niveis, url: url('regras/aparencia-virtudes-vontade') }; }
    else if (k === 'centelha') { p = { tipo: 'traço', nome: 'Centelha', descricao: TRACO_DESC.centelha, niveis: escala('escalaCentelha'), url: url('regras/centelha') }; }
    else if (k === 'willpower') { p = { tipo: 'traço', nome: 'Força de Vontade', descricao: TRACO_DESC.willpower, niveis: escala('escalaVontade'), url: url('regras/aparencia-virtudes-vontade') }; }
    else if (k === 'aparencia') { p = { tipo: 'traço', nome: 'Aparência', descricao: TRACO_DESC.aparencia, niveis: escala('escalaAparencia'), url: url('regras/aparencia-virtudes-vontade') }; }
    if (p && (window as any).refModal) (window as any).refModal(p);
  }
  const CAM_ORDER = (CAM_D as any[]).map((c) => c.id);
  const CAM_NOME: Record<string, string> = Object.fromEntries((CAM_D as any[]).map((c) => [c.id, c.nome]));
  const CAM_ATR: Record<string, string> = Object.fromEntries((CAM_D as any[]).map((c) => [c.id, c.atributo]));
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
  const centReq = (b: number) => b;
  function racialAttr(key?: string): number { return key ? (RACA[S.raca]?.atributos?.[key] || 0) : 0; }
  /**
   * O teto de cada trilha. Não há mais modo de Criação: o que segura a ficha é o
   * ORÇAMENTO de XP, não uma trava por cima do que se pode marcar. Sobra só o teto da
   * régua (0–6, ou 0–12 em Vontade e Aparência) e o da raça, que é traço da raça e não
   * limite de criação.
   */
  function capFor(kind: string, key?: string): number {
    // Feitiçaria: a trava de nível por Ocultismo foi removida. Basta Centelha > 0 para tocar a magia;
    // a profundidade (nível da Arte) é comprada com XP. (Relação com Ocultismo será refeita nas Trilhas de Feitiçaria.)
    if (kind === 'arte2') return (S.centelha || 0) > 0 ? 6 : 0;
    const rac = kind === 'attr' ? racialAttr(key) : 0;
    const teto: Record<string, number> = { attr: 6, skill: 6, skill2: 6, virtue: 6, centelha: 6, willpower: 12, aparencia: 12 };
    return (teto[kind] ?? 6) + rac;
  }

  // ---- estado ----
  let S: any;
  const OPEN = { cam: {} as Record<string, boolean> };
  function fresh() {
    // Ficha nova nasce no piso de cada trilha: custo zero até o jogador comprar algo.
    S = { id: {}, attrs: {}, skills: {}, spec: {}, skills2: {}, spec2: {}, virtues: {}, willpower: pisoXp('vontade'), aparencia: pisoXp('aparencia'), centelha: 0, raca: 'humano', tech: {}, arte: {}, efeito: {}, budget: 1500, equip: { armaduras: [] }, arsenal: [], conjuntos: mkConjuntos(), bolsas: mkBolsas(), defSpec: { esquiva: [], bloqueio: [], social: [], mental: [] } };
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] = pisoXp('atributo')));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] = pisoXp('habilidadePrimaria'); S.spec[h.id] = []; });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] = pisoXp('virtude')));
    SECONDARY.forEach(([n]) => { S.skills2[slug(n)] = 0; S.spec2[slug(n)] = []; });
    S.livreNome = {}; LIVRES.forEach((k) => { S.skills2[k] = 0; S.spec2[k] = []; });
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
    // `pesoTotal` em branco quer dizer "some as linhas". É o que quase sempre vale, e o
    // campo só existe para quem não quer escrever item por item: dez quilos de miudezas
    // anotadas como 25 kg de miudezas não escritas.
    return { nome, itens, pesoTotal: String(b?.pesoTotal ?? '') };
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
    // Migração: secundárias renomeadas e fundidas na revisão de nomenclatura. A chave de
    // S.skills2 é o slug do nome, então trocar o nome perderia o nível comprado se ele não
    // fosse transferido. Nas fusões fica o MAIOR dos dois níveis, e não a soma: quem tinha
    // Abrir Fechaduras 3 e Ladinagem 2 sai com Abrir Mecanismos 3, sem ganhar de graça.
    // As que sumiram sem destino (Armadureiro, Armeiro, Jogos, Apostar, Roubo, Vigilância
    // Urbana, Mineração) simplesmente deixam de ser desenhadas e devolvem o XP.
    const RENOMES: [string, string][] = [
      ['culinaria', 'gastronomia'], ['veterinario', 'veterinaria'],
      ['ferraria', 'ferreiro'], ['escrivania', 'escrivao'], ['comercio', 'comerciante'],
      ['abrir-fechaduras', 'abrir-mecanismos'], ['ladinagem', 'abrir-mecanismos'], ['marcenaria', 'carpintaria'],
      ['contrabando', 'ocultacao'], ['falsificacao', 'ocultacao'],
    ];
    for (const [velho, novo] of RENOMES) {
      if (S.skills2?.[velho] == null) continue;
      S.skills2[novo] = Math.max(S.skills2[novo] || 0, S.skills2[velho] || 0);
      if ((S.spec2?.[velho] || []).length && !(S.spec2?.[novo] || []).length) S.spec2[novo] = S.spec2[velho];
      delete S.skills2[velho]; if (S.spec2) delete S.spec2[velho];
    }
    S.willpower ??= pisoXp('vontade'); S.aparencia ??= pisoXp('aparencia'); S.centelha ??= 0; S.raca ??= 'humano'; if (!RACA[S.raca]) S.raca = 'humano'; S.budget ??= 1500; S.derivCol ??= true; delete S.modo;   // o modo Criacao/Evolucao foi removido
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
    ).filter((p: any) => baseArmadura(p.base));
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
    // vazia quer dizer "use a conta"; qualquer coisa escrita manda nela
    S.cargaAtual = String(S.cargaAtual ?? '');
    (ATTRS_D as any[]).forEach((a) => (S.attrs[a.id] ??= 1));
    (HAB_D as any[]).forEach((h) => { S.skills[h.id] ??= 0; S.spec[h.id] = clampSpecs(S.spec[h.id], S.skills[h.id] || 0); });
    (VIRT_D as any[]).forEach((v) => (S.virtues[v.id] ??= 1));
    SECONDARY.forEach(([n]) => { const k = slug(n); S.skills2[k] ??= 0; S.spec2[k] = clampSpecs(S.spec2[k], S.skills2[k] || 0); });
    S.livreNome ??= {};
    LIVRES.forEach((k) => { S.skills2[k] ??= 0; S.spec2[k] = clampSpecs(S.spec2[k], S.skills2[k] || 0); });
  }
  const save = () => { if (opts.readOnly) return; try { opts.salvar(S); } catch {} };

  // ---- builders ----
  const dotsHTML = (kind: string, key: string, value: number, max: number, floor: number) => {
    const cap = capFor(kind, key);
    let h = `<span class="dots" data-kind="${kind}" data-key="${key}" tabindex="0" role="slider" aria-valuemin="${floor}" aria-valuemax="${cap}" aria-valuenow="${value}" aria-label="${key.replace(/-/g, ' ')} (use as setas)">`;
    for (let d = 1; d <= max; d++) {
      const capped = d > cap;
      const tip = capped ? ' title="Limite de criação — ative \'Evolução\' na barra de XP para passar daqui"' : '';
      h += `<span class="dot${d <= value ? ' on' : ''}${d <= floor ? ' free' : ''}${capped ? ' cap' : ''}" data-d="${d}"${tip}>`
        + (kind === 'centelha' ? sparkSVG(d <= value) : '') + `</span>`;
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
    // Nas Secundárias livres o nome está num <input>, e textContent daria vazio.
    const alvo = anchor.closest('.trow')?.querySelector('.nm');
    const nome = alvo?.querySelector<HTMLInputElement>('input')?.value.trim()
      || alvo?.textContent?.trim() || 'Habilidade';
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
    const catalogo = ordem.filter((g) => (groups[g] || []).length).map((g) =>
      grupoHTML(g, groups[g].map((n) => { const k = slug(n); return trow(n, dotsHTML('skill2', k, S.skills2[k] || 0, 6, 0) + specBtn('s', k, S.skills2[k] || 0, specCount(S.spec2[k]))); }))).join('');
    // As três vagas em branco, no fim. O nome é um campo de texto e não abre o modal do traço;
    // o resto da linha (bolinhas e ✦) se comporta como qualquer outra Secundária.
    const livres = grupoHTML('Livres', LIVRES.map((k) => trow(
      `<input class="livre-nm" type="text" data-livre="${k}" value="${(nomeLivre(k)).replace(/"/g, '&quot;')}" aria-label="Nome da secundária livre"${opts.readOnly ? ' readonly' : ''}>`,
      dotsHTML('skill2', k, S.skills2[k] || 0, 6, 0) + specBtn('s', k, S.skills2[k] || 0, specCount(S.spec2[k])))));
    el('secondary').innerHTML = catalogo + livres;
  }
  function renderCaminhos() {
    const card = (cam: string) => {
      const techs = CAMTREE[cam] || [];
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
      return `<div class="cam"><div class="cam-head" data-camtog="${cam}"><span class="chev">${open ? '▾' : '▸'}</span><span class="cam-nm">${CAM_NOME[cam]}</span></div><div class="cam-body" style="display:${open ? 'block' : 'none'}">${rows}</div></div>`;
    };
    // As Proezas ficam agrupadas pelo Atributo que cada uma puxa (campo `atributo` de
    // caminhos.json), na mesma ordem em que os Atributos aparecem na ficha. Cada grupo
    // pega a largura toda e abre em três colunas próprias, como os grupos de Habilidades.
    // Uma Proeza cujo atributo não bata com nenhum da lista não some: cai num grupo final.
    const grupos = (ATTRS_D as any[]).map((a) => ({ nome: a.nome, ids: CAM_ORDER.filter((id) => CAM_ATR[id] === a.id) }));
    const conhecidos = new Set((ATTRS_D as any[]).map((a) => a.id));
    const soltas = CAM_ORDER.filter((id) => !conhecidos.has(CAM_ATR[id]));
    if (soltas.length) grupos.push({ nome: 'Outras', ids: soltas });
    el('tecnicas').innerHTML = grupos.filter((g) => g.ids.length).map((g) =>
      `<section class="camgrupo"><h3>${g.nome}</h3><div class="cols3">${col3(g.ids, card)}</div></section>`).join('');
  }
  // Os níveis de cada Arte não abrem mais embaixo do cabeçalho: vêm num cartão que
  // aparece ao passar o mouse (ou ao tabular até as bolinhas). São 24 Artes de 6 níveis
  // cada, e abrir umas quantas empurrava a lista inteira para baixo.
  const arteFx = (a: any, lvl: number) =>
    a.niveis.map((n: any) => `<div class="fxline${n.nivel <= lvl ? ' hi' : ''}">${n.nivel} — <b>${n.nome}</b>: ${n.efeito}</div>`).join('');
  // No papel não existe hover. Cada Arte que o personagem tem imprime os níveis que ele
  // alcançou (os outros não fazem falta na mesa); Arte em zero não imprime nada.
  const artePrint = (a: any, lvl: number) =>
    !lvl ? '' : `<div class="arte-print">${a.niveis.filter((n: any) => n.nivel <= lvl)
      .map((n: any) => `<div class="fxline hi">${n.nivel} — <b>${n.nome}</b>: ${n.efeito}</div>`).join('')}</div>`;
  // ---- Cartão flutuante: níveis da Arte, detalhe do Efeito ----
  // Um por vez, preso ao documento e ancorado em quem o abriu, como o das formas
  // (FormasPop.astro). No toque não há hover: tocar prende o cartão, tocar de novo,
  // tocar fora ou Escape fecha. `fonte` guarda como reencontrar a âncora e como
  // reconstruir o conteúdo, porque redesenhar a lista joga fora os dois.
  let pop: HTMLDivElement | null = null, popKey: string | null = null, popPreso = false, popTimer = 0;
  let popFonte: { sel: string; html: () => string } | null = null;
  function fecharPop() { pop?.remove(); pop = null; popKey = null; popPreso = false; popFonte = null; }
  const agendarPop = () => { if (popPreso) return; clearTimeout(popTimer); popTimer = window.setTimeout(fecharPop, 200); };
  const cancelarPop = () => clearTimeout(popTimer);
  function posicionarPop(anchor: HTMLElement) {
    if (!pop) return;
    const r = anchor.getBoundingClientRect();
    pop.style.left = '0px';
    pop.style.top = window.scrollY + r.bottom + 6 + 'px';
    const max = window.scrollX + document.documentElement.clientWidth - pop.offsetWidth - 10;
    pop.style.left = Math.max(8, Math.min(window.scrollX + r.left, max)) + 'px';
  }
  function abrirPop(anchor: HTMLElement, key: string, classe: string, sel: string, html: () => string) {
    if (pop && popKey === key) return;
    fecharPop();
    popKey = key; popFonte = { sel, html };
    pop = document.createElement('div');
    pop.className = 'ficha-pop ' + classe;
    pop.innerHTML = html();
    pop.addEventListener('mouseenter', cancelarPop);
    pop.addEventListener('mouseleave', agendarPop);
    document.body.append(pop);
    posicionarPop(anchor);
  }
  function religarPop() {
    if (!pop || !popFonte) return;
    const anchor = document.querySelector<HTMLElement>(popFonte.sel);
    if (!anchor) { fecharPop(); return; }
    pop.innerHTML = popFonte.html();
    posicionarPop(anchor);
  }
  const conteudoArtePop = (a: any) => {
    const lvl = S.arte[a.id] || 0;
    return `<span class="ficha-pop-tit">${a.nome}<small>${lvl ? `nível ${lvl}` : 'nenhum nível'}</small></span>${arteFx(a, lvl)}`;
  };
  function abrirArtePop(head: HTMLElement) {
    const id = head.dataset.artepop!;
    const a = (ARTE_D as any[]).find((x) => x.id === id); if (!a) return;
    abrirPop(head, 'arte:' + id, 'arte-pop', `.arte-head[data-artepop="${id}"]`, () => conteudoArtePop(a));
  }
  function renderArtes() {
    const card = (a: any) => {
      const lvl = S.arte[a.id] || 0;
      return `<div class="cam"><div class="cam-head arte-head" data-artepop="${a.id}"><span class="cam-nm">${a.nome}</span>${dotsHTML('arte2', a.id, lvl, 6, 0)}</div>${artePrint(a, lvl)}</div>`;
    };
    el('artes').innerHTML = col3(ARTE_D as any[], card);
    religarPop();
    renderEfeitos();
  }
  // Efeitos Especiais: só aparecem os que o personagem alcança, ou seja, aqueles
  // cujo nível é menor ou igual ao nível dele em pelo menos uma das Artes que os comportam.
  const idRef = (x: any) => (typeof x === 'string' ? x : x?.id);
  const nomeArte = (id: string) => (ARTE_D as any[]).find((a) => a.id === id)?.nome || id;
  // Área e Volume abrem o cartão de formas ao passar o mouse (ver FormasPop)
  const rotPar = (n: string) => {
    const f = formaDe(n);
    return f ? `<span data-formas="${f}" tabindex="0">${n}</span>` : n;
  };
  // As Artes que comportam o Efeito E em que o personagem já tem o nível dele.
  const artesDe = (e: any) => e.artes.filter((x: any) => (S.arte[idRef(x.id)] || 0) >= e.nivel);
  // No cartãozinho ficam os parâmetros de forma (alcance, área, dano, duração), no osso:
  // nome e valor curto, sem a escala. Jogada e Dificuldade entram só pelo nome, porque
  // com os valores tomavam duas linhas por cartão; o cartão de hover diz quais são.
  const parCurto = (e: any) => ordemPar(e.parametros)
    .map((p: any) => (rank(p) > PAR_FORMA ? rotPar(p.nome)
      : p.tipo === 'fixo' ? `${rotPar(p.nome)}: ${p.valor}`
      : p.regua ? `${rotPar(p.nome)}: ${p.regua === 'longa' ? 'Longa' : 'Breve'}`
      : rotPar(p.nome)))
    .join(' · ');
  // O cartão de hover é onde cabe o resto: o que o Efeito faz, o sabor que cada Arte
  // dele dá (é o que separa a Neblina de Água da Neblina de Terra) e a escala de cada
  // parâmetro. Nada disso cabia na linha de uma lista.
  const conteudoEfeitoPop = (e: any) => {
    const sabores = artesDe(e).filter((x: any) => x.sabor)
      .map((x: any) => `<div class="ef-pop-sab"><b>${nomeArte(idRef(x.id))}:</b> ${x.sabor}</div>`).join('');
    const pars = ordemPar(e.parametros).map((p: any) => {
      const nota = p.tipo === 'substitui'
        ? (p.nota ? `<small>${p.escala.join(' · ')}${p.unidade ? ` (${p.unidade})` : ''}</small>` : '')
        : (p.nota ? `<small>${p.nota}</small>` : '');
      return `<div class="ef-pop-p"><b>${rotPar(p.nome)}:</b> ${valorPar(p)}${nota}</div>`;
    }).join('');
    const cab = `nível ${e.nivel} · ${custoEfeito(e.nivel)} XP${S.efeito[e.id] ? ' · comprado' : ''}`;
    return `<span class="ficha-pop-tit">${e.nome}<small>${cab}</small></span>
      <div class="ef-pop-tx">${e.efeito}</div>${sabores}${pars}${e.notas ? `<div class="ef-pop-nota muted">${e.notas}</div>` : ''}`;
  };
  // O gatilho é o nome, mas quem ancora é o cartão inteiro: abrindo embaixo do nome, o
  // detalhe cobria justamente o cartão que a pessoa estava lendo.
  function abrirEfeitoPop(alvo: HTMLElement) {
    const id = alvo.dataset.efpop || alvo.dataset.efbuy!;
    const e = (EFEITO_D as any[]).find((x) => x.id === id); if (!e) return;
    const sel = `.ef-card[data-efbuy="${id}"]`;
    abrirPop(alvo.closest<HTMLElement>('.ef-card') || alvo, 'efeito:' + id, 'efeito-pop', sel, () => conteudoEfeitoPop(e));
  }
  function renderEfeitos() {
    const box = document.getElementById('efeitos-esp');
    if (!box) return;
    const disp = (EFEITO_D as any[])
      .filter((e) => artesDe(e).length)
      .sort((a, b) => a.nivel - b.nivel || a.nome.localeCompare(b.nome, 'pt'));
    if (!disp.length) {
      box.innerHTML = '<div class="ef-vazio muted">Os Efeitos Especiais aparecem aqui quando você tiver uma Arte no nível que cada um exige.</div>';
      religarPop();
      return;
    }
    // Um Efeito pode caber em várias Artes, mas a compra é uma só (mesmo id): ele aparece
    // uma vez, com as Artes suas que o comportam listadas no próprio cartão. Antes vinha
    // repetido num grupo por Arte, e metade da lista era a mesma coisa dita de novo.
    const card = (e: any) => {
      const on = !!S.efeito[e.id];
      const artes = artesDe(e).map((x: any) => nomeArte(idRef(x.id))).join(' · ');
      return `<div class="ef-card${on ? ' on' : ''}" data-efbuy="${e.id}">
        <div class="ef-c-top">
          <input type="checkbox" data-efeito="${e.id}"${on ? ' checked' : ''}${opts.readOnly ? ' disabled' : ''} aria-label="${e.nome}" />
          <span class="ef-c-nm" data-efpop="${e.id}">${e.nome}</span>
          <span class="ef-i-nv" title="exige a Arte no nível ${e.nivel}">${e.nivel}</span>
          <span class="ef-c-xp">${custoEfeito(e.nivel)} XP</span>
        </div>
        <div class="ef-c-ar">${artes}</div>
        <div class="ef-c-tx">${e.efeito}</div>
        <div class="ef-c-par muted">${parCurto(e)}</div>
      </div>`;
    };
    const comprados = (EFEITO_D as any[]).filter((e) => S.efeito[e.id]);
    const gastos = comprados.reduce((s, e) => s + custoEfeito(e.nivel), 0);
    const conta = `${disp.length} ao alcance${comprados.length ? ` · ${comprados.length} comprado${comprados.length > 1 ? 's' : ''} · ${gastos} XP` : ' · nenhum comprado'}`;
    box.innerHTML = `<div class="ef-esp-head"><b>Efeitos Especiais</b><span class="muted">${conta}</span></div>
      <div class="ef-esp-list">${disp.map(card).join('')}</div>`;
    religarPop();
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
  const IMPROV = { nome: 'Arma personalizada', dado: 1, danoBonus: 0, acerto: -2, defesaArma: 0, maos: 1, ticks: 5, folego: 0, atrib: 'forca', pericia: 'briga', tags: [] as string[], tipoDano: 'impacto', forcaMult: 1 };
  // Peça fora do catálogo, nos dois lados do arsenal. São duas porque uma arma e
  // um escudo não têm os mesmos números: a arma pede Velocidade/Acerto/Dano/Defesa,
  // o escudo pede Defesa/Penalidade. Uma opção só obrigava o escudo a nascer arma
  // e a ter os campos errados no ajuste.
  const ESCUDO_LIVRE = { nome: 'Escudo personalizado', bloqCaC: 0, penalidade: 0, habilProjetil: false };
  const REF_ARMA_LIVRE = 'c', REF_ESCUDO_LIVRE = 'ce';
  const refLivre = (ref: any) => ref === REF_ARMA_LIVRE || ref === REF_ESCUDO_LIVRE;
  const ehLivre = (p: any) => refLivre(p && p.ref);
  const clampImprov = (v: any, lo: number, hi: number, dflt: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : dflt; };
  function itemDe(slot: any) {
    const ref = (slot && slot.ref) || 'nada';
    if (ref === REF_ESCUDO_LIVRE) {
      const base = { ...ESCUDO_LIVRE, nome: (slot && slot.nome) || ESCUDO_LIVRE.nome };
      const s = escudoComMod(base, slot?.mod);
      return { kind: 'escudo', nome: s.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, habilProjetil: !!s.habilProjetil, base, s };
    }
    if (ref === 'c') {
      // O item personalizado passou a usar o mesmo "ajustar" das peças de catálogo,
      // em vez de três campos próprios. A base continua sendo o que a peça guardou
      // (fichas antigas não perdem nada); o `mod` entra por cima, como em qualquer
      // outra peça, e com ele vêm Velocidade e Defesa, que antes não dava para mexer.
      const base = { ...IMPROV, nome: (slot && slot.nome) || IMPROV.nome,
        dado: clampImprov(slot?.dado, 1, 2, IMPROV.dado),
        danoBonus: clampImprov(slot?.danoBonus, -2, 2, IMPROV.danoBonus),
        acerto: clampImprov(slot?.acerto, -6, 6, IMPROV.acerto) };
      const w = armaComMod(base, slot?.mod);
      return { kind: 'custom', nome: w.nome, def: w.defesaArma || 0, pen: 0, w, base };
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

  // ---- o peso que o personagem leva no corpo -------------------------------------
  // Todo campo de peso aqui é uma ESTIMATIVA que o jogador pode contradizer: escrever um
  // número manda nele, apagar devolve a conta. É a única forma honesta, porque a ficha
  // nunca vai saber de tudo o que o personagem está levando.
  /** Número curto, com vírgula: 122 · 10 · 1,5. Uma casa só, e nenhuma acima de 100. */
  const r1n = (n: number) =>
    (n >= 100 ? String(Math.round(n)) : String(Math.round(n * 10) / 10)).replace('.', ',');
  /** O primeiro número de um campo escrito à mão: "1,5", "2 kg", "≈3" e "3.2" valem igual. */
  const numPeso = (s: any) => {
    const m = String(s ?? '').replace(',', '.').match(/\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : 0;
  };
  /** Peso de catálogo de uma peça do arsenal, que guarda armas e escudos no mesmo lugar. */
  const pesoRef = (ref: any) => {
    const r = String(ref || '');
    const b = r.startsWith('a:') ? ARMA[r.slice(2)] : r.startsWith('e:') ? ESCUDO[r.slice(2)] : null;
    return Number(b?.peso) || 0;
  };
  /** Soma das linhas de uma bolsa, ou o total que o jogador escreveu no lugar dela. */
  const pesoBolsa = (b: any) => {
    const escrito = String(b?.pesoTotal ?? '').trim();
    return escrito ? numPeso(escrito)
      : (b?.itens || []).reduce((s: number, l: any) => s + numPeso(l.peso), 0);
  };
  /** As três bolsas, mais o arsenal inteiro, mais a armadura VESTIDA. */
  const cargaCalculada = () =>
    (S.bolsas || []).reduce((s: number, b: any) => s + pesoBolsa(b), 0)
    + (S.arsenal || []).reduce((s: number, p: any) => s + pesoRef(p?.ref), 0)
    + (S.equip?.armaduras || []).reduce((s: number, p: any) => typeof p === 'string'
      ? s + (Number(baseArmadura(p)?.peso) || 0)
      : p?.vestida === false ? s : s + (Number(baseArmadura(p?.base)?.peso) || 0), 0);
  const cargaAtual = () => {
    const escrito = String(S.cargaAtual ?? '').trim();
    return escrito ? numPeso(escrito) : cargaCalculada();
  };
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
    return `<optgroup label="Armas (Vel/Acerto/Dano/Defesa)">${armas}</optgroup><optgroup label="Escudos">${escudos}</optgroup>${vazio}` +
      `<option value="${REF_ARMA_LIVRE}"${sel === REF_ARMA_LIVRE ? ' selected' : ''}>Arma personalizada…</option>` +
      `<option value="${REF_ESCUDO_LIVRE}"${sel === REF_ESCUDO_LIVRE ? ' selected' : ''}>Escudo personalizado…</option>`;
  }

  // ===== Arsenal: as armas e escudos que o personagem POSSUI =====
  // Os conjuntos de mãos escolhem daqui, não do catálogo inteiro. É o que faz a imagem
  // pertencer à peça: a mesma espada usada em dois conjuntos mostra a mesma foto.
  const nomePeca = (p: any) => p.nome || itemDe(p).nome;
  /**
   * Item personalizado: não tem catálogo, então o nome é digitado na peça. Os
   * números ficam no "ajustar", o mesmo das outras peças — antes eram três campos
   * próprios aqui (Dado, Bônus, Acerto), que davam menos controle e ainda deixavam
   * a peça sem como mexer em Velocidade e Defesa.
   */
  function improvisado(_p: any, ro: boolean) {
    return `<span class="eq-improv-nota muted">Peça fora do catálogo: ${ro ? 'nome e números são do jogador' : 'o nome e os números saem do ✎ ajustar'}.</span>`;
  }
  /**
   * Campo de nome, que vive DENTRO do painel de ajuste. Renomear é ajustar: é o
   * que separa uma Espada Longa Ótima da Espada Longa do catálogo, e é o único
   * jeito de batizar uma peça personalizada. Na face do card o nome é texto, e
   * assim o card inteiro continua servindo de alça para reordenar.
   */
  /**
   * Atributos que fazem do card uma peça movível. O card inteiro é a alça do
   * arrasto, e o `tabindex` é o que mantém o caminho do teclado agora que a alça
   * ⠿ saiu: com o card em foco, as setas movem uma casa.
   */
  function ordenavel(ro: boolean, nome: string) {
    return ro ? '' : ` tabindex="0" title="Arraste para reordenar (ou use as setas com o card em foco)"`
      + ` aria-label="${escapeHtml(nome)}: arraste ou use as setas para mudar a ordem"`;
  }
  function campoNome(attr: string, uid: string, valor: string, ph: string, ro: boolean) {
    return `<label class="eqm-c eqm-nome"><span>Nome</span>
      <input type="text" class="eq-nome-in" data-${attr}="${uid}" value="${escapeHtml(valor)}"
        placeholder="${escapeHtml(ph)}"${ro ? ' disabled' : ''} aria-label="Nome desta peça" /></label>`;
  }

  /** Onde o toque é do próprio elemento (digitar, escolher, apertar) e não do arrasto. */
  const CONTROLES = 'input, select, textarea, a, label, [contenteditable]';

  /**
   * Copia o que o clone não traz: cloneNode leva o atributo `value`, não o valor
   * que o jogador digitou depois. Sem isto o card voador nasce com os campos em
   * branco no meio do arrasto.
   */
  function copiaValores(de: HTMLElement, para: HTMLElement) {
    const orig = de.querySelectorAll<HTMLInputElement>('input, select, textarea');
    const copia = para.querySelectorAll<HTMLInputElement>('input, select, textarea');
    orig.forEach((campo, i) => {
      const c = copia[i];
      if (!c) return;
      c.value = campo.value;
      if (campo.type === 'checkbox' || campo.type === 'radio') c.checked = campo.checked;
    });
  }

  /**
   * Reordenar por arrasto, servindo mouse, caneta e toque com um código só
   * (eventos de ponteiro; o arrastar-e-soltar do HTML não pega em toque).
   *
   * Pega em QUALQUER ponto do card, menos nos controles. Para o clique comum não
   * virar arrasto sem querer, o arrasto só nasce depois de um limiar: no mouse,
   * uns pixels de caminho; no toque, um segurar parado (assim o dedo continua
   * rolando a página normalmente).
   *
   * Enquanto arrasta há duas peças na tela: um CLONE voando sob o ponteiro e o
   * card original virado vaga, que anda no DOM assim que o ponteiro cruza o meio
   * de um vizinho. A vaga é a prévia do resultado, e a grade reflui sozinha. No
   * fim, a ordem nova é lida do DOM e devolvida em uids.
   */
  function ativarArrasto(idCont: string, attr: string, aplicar: (uids: string[]) => void) {
    const cont = el(idCont);
    const cards = () => [...cont.querySelectorAll<HTMLElement>(`[${attr}]`)];
    const uidsNaTela = () => cards().map((c) => c.getAttribute(attr)!);
    const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Anima os cards da posição velha para a nova, para a troca ser vista (FLIP),
     * e TRANCA a decisão enquanto eles voam.
     *
     * A trava é o que impede a peça de ir e voltar: um card em pleno voo mente
     * sobre onde está. `getBoundingClientRect` devolve a posição animada, e
     * `elementFromPoint` acha quem está passando por cima do ponteiro, não quem
     * mora ali. Medindo no meio do voo, a troca recém-feita era logo desfeita, e
     * o par ficava batendo de um lado para o outro.
     */
    const DUR = 150;
    let travaAte = 0;
    const comAnimacao = (mudanca: () => void) => {
      if (!suave) { mudanca(); return; }
      const antes = new Map(cards().map((c) => [c, c.getBoundingClientRect()]));
      mudanca();
      let voou = false;
      for (const c of cards()) {
        const a = antes.get(c);
        if (!a) continue;
        const d = c.getBoundingClientRect();
        const dx = a.left - d.left, dy = a.top - d.top;
        if (!dx && !dy) continue;
        c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
          { duration: DUR, easing: 'ease-out' });
        voou = true;
      }
      if (voou) travaAte = performance.now() + DUR;
    };

    cont.addEventListener('pointerdown', (e) => {
      if (opts.readOnly || e.button > 0) return;
      const onde = e.target as HTMLElement;
      const card = onde.closest<HTMLElement>(`[${attr}]`);
      if (!card || card.parentElement !== cont) return;
      // a imagem em enquadramento é do outro arrasto: ali o ponteiro desloca a foto
      if (onde.closest(`${CONTROLES}, button, .eq-img.enq`)) return;

      const toque = e.pointerType === 'touch';
      const x0 = e.clientX, y0 = e.clientY;
      let ponteiro = { x: x0, y: y0 };
      let arrastando = false;
      let espera = 0;
      let laco = 0;
      let fantasma: HTMLElement | null = null;
      let dx = 0, dy = 0;

      /** Enquanto arrasta, o dedo é do arrasto: o navegador não rola a página. */
      const barra = (ev: Event) => ev.preventDefault();

      const comecar = () => {
        arrastando = true;
        travaAte = 0;
        // o mouse já pode ter começado a pintar texto no caminho até o limiar
        getSelection()?.removeAllRanges();
        const r = card.getBoundingClientRect();
        dx = ponteiro.x - r.left;
        dy = ponteiro.y - r.top;
        fantasma = card.cloneNode(true) as HTMLElement;
        copiaValores(card, fantasma);
        // clone inerte: sem id repetido na página e fora do alcance do leitor de tela
        fantasma.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'));
        fantasma.setAttribute('aria-hidden', 'true');
        fantasma.classList.add('eq-fantasma');
        fantasma.style.width = `${r.width}px`;
        fantasma.style.height = `${r.height}px`;
        fantasma.style.transform = `translate(${r.left}px, ${r.top}px)`;
        document.body.appendChild(fantasma);
        card.classList.add('arrastando');
        // sem isto o card sob o ponteiro seria sempre o próprio, e elementFromPoint
        // nunca enxergaria o vizinho por baixo
        card.style.pointerEvents = 'none';
        document.body.classList.add('eq-arrastando');
        document.addEventListener('touchmove', barra, { passive: false });
        laco = requestAnimationFrame(quadro);
      };

      /** Onde a vaga cai, olhando quem está sob o ponteiro. */
      const acomoda = () => {
        if (performance.now() < travaAte) return;   // cards no ar: ninguém mede nada
        const sob = document.elementFromPoint(ponteiro.x, ponteiro.y);
        const alvo = sob && (sob as HTMLElement).closest<HTMLElement>(`[${attr}]`);
        if (!alvo || alvo === card || alvo.parentElement !== cont) return;
        const r = alvo.getBoundingClientRect();
        const rc = card.getBoundingClientRect();
        const lista = cards();
        const antes = lista.indexOf(alvo) < lista.indexOf(card);
        // Um eixo só, e é a geometria que diz qual: dois cards que se sobrepõem
        // na vertical estão lado a lado (compara o X); senão, um está sobre o
        // outro (compara o Y). Testar os dois eixos juntos fazia a peça ir e
        // voltar sem sair do lugar quando a grade tinha uma coluna só.
        const juntos = Math.min(r.bottom, rc.bottom) - Math.max(r.top, rc.top);
        const mesmaLinha = juntos > Math.min(r.height, rc.height) / 2;
        // Entrar uma faixa adentro do vizinho basta. Era o meio dele, e no
        // celular o card tem meia tela de altura: com uma coluna só, o meio do
        // vizinho de baixo ficava fora do alcance do dedo. A faixa é menor que a
        // metade, e é essa folga que segura o vaivém.
        const fy = Math.min(r.height / 2, 64), fx = Math.min(r.width / 2, 64);
        const passou = mesmaLinha
          ? (antes ? ponteiro.x < r.right - fx : ponteiro.x > r.left + fx)
          : (antes ? ponteiro.y < r.bottom - fy : ponteiro.y > r.top + fy);
        if (passou) comAnimacao(() => cont.insertBefore(card, antes ? alvo : alvo.nextSibling));
      };

      /**
       * Perto da borda a tela anda sozinha: no celular o card ocupa quase tudo e
       * o vizinho de destino costuma estar fora da vista.
       */
      const MARGEM = 80, VEL = 16;
      const quadro = () => {
        if (!arrastando) return;
        laco = requestAnimationFrame(quadro);
        const h = window.innerHeight;
        const d = ponteiro.y < MARGEM ? -VEL * (1 - ponteiro.y / MARGEM)
          : ponteiro.y > h - MARGEM ? VEL * (1 - (h - ponteiro.y) / MARGEM) : 0;
        // o fantasma é `fixed` e segue o ponteiro; quem muda com a rolagem é
        // apenas o vizinho que está por baixo
        if (d) window.scrollBy(0, d);
        // rever a cada quadro, e não só quando o ponteiro anda: a decisão fica
        // trancada enquanto os cards voam, e é aqui que ela volta a acontecer
        // com o ponteiro parado
        acomoda();
      };

      const mover = (ev: PointerEvent) => {
        ponteiro = { x: ev.clientX, y: ev.clientY };
        if (!arrastando) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < (toque ? 10 : 5)) return;
          // dedo andando antes da espera acabar: é rolagem, não arrasto
          if (toque) { soltar(); return; }
          comecar();
        }
        ev.preventDefault();
        fantasma!.style.transform = `translate(${ev.clientX - dx}px, ${ev.clientY - dy}px)`;
        acomoda();
      };

      const soltar = () => {
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
        window.removeEventListener('pointercancel', soltar);
        document.removeEventListener('touchmove', barra);
        clearTimeout(espera);
        cancelAnimationFrame(laco);
        if (!arrastando) return;
        arrastando = false;
        card.classList.remove('arrastando');
        card.style.pointerEvents = '';
        document.body.classList.remove('eq-arrastando');
        // o clone pousa na vaga antes de sumir: mostra onde a peça foi parar
        const fim = card.getBoundingClientRect();
        const f = fantasma!;
        f.animate([{ transform: f.style.transform, opacity: '1' },
          { transform: `translate(${fim.left}px, ${fim.top}px)`, opacity: '0' }],
          { duration: suave ? 170 : 0, easing: 'ease-out' }).onfinish = () => f.remove();
        aplicar(uidsNaTela());
        // o arrasto que termina em cima de um botão não pode apertá-lo
        const engole = (ce: Event) => { ce.stopPropagation(); ce.preventDefault(); };
        window.addEventListener('click', engole, true);
        setTimeout(() => window.removeEventListener('click', engole, true), 60);
      };

      // No toque, o arrasto pede um segurar parado: é o que separa "quero mover
      // este card" de "quero rolar a lista".
      if (toque) espera = window.setTimeout(comecar, 320);
      // Na JANELA, e não no card. O card acabou de receber `pointer-events: none`,
      // e assim ele deixa de receber o `pointerup`: o arrasto reordenava a tela e
      // nunca gravava nada.
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
    });

    // Teclado: as setas movem uma casa, para quem não arrasta. O alvo é o CARD,
    // que ganhou tabindex justamente por isto — a alça ⠿ saiu da tela e levaria o
    // teclado junto se o card não fosse alcançável.
    cont.addEventListener('keydown', (e) => {
      if (opts.readOnly) return;
      const card = e.target as HTMLElement;
      if (!card.hasAttribute?.(attr)) return;
      const passo = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1
        : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : 0;
      if (!passo) return;
      e.preventDefault();
      const uid = card.getAttribute(attr)!;
      const uids = uidsNaTela();
      const i = uids.indexOf(uid);
      const j = i + passo;
      if (i < 0 || j < 0 || j >= uids.length) return;
      [uids[i], uids[j]] = [uids[j], uids[i]];
      aplicar(uids);
      // o card foi redesenhado: devolve o foco à mesma peça
      requestAnimationFrame(() => cont.querySelector<HTMLElement>(`[${attr}="${uid}"]`)?.focus());
    });
  }

  /** Põe a lista na ordem dos uids que vieram da tela. */
  function reordenar<T extends { uid: string }>(lista: T[], uids: string[]): T[] {
    const porUid = new Map(lista.map((p) => [p.uid, p]));
    const nova = uids.map((u) => porUid.get(u)).filter(Boolean) as T[];
    // o que a tela não mostrava (peça filtrada, por exemplo) fica no fim, não some
    for (const p of lista) if (!uids.includes(p.uid)) nova.push(p);
    return nova;
  }

  /**
   * O id de catálogo da peça, que é o que dá nome à classe da arte do sistema
   * (`.arte-espada-longa`). Arma e escudo guardam em `ref` com prefixo; armadura
   * guarda em `base`. Item improvisado não tem arte: é objeto de ocasião.
   */
  function idDeArte(p: any): string {
    const ref = p && p.ref;
    if (typeof ref === 'string' && (ref.startsWith('a:') || ref.startsWith('e:'))) return ref.slice(2);
    const base = (p && p.base) || '';
    // peça personalizada não tem gravura: devolver o id dela deixaria o quadro
    // vazio, sem nem o convite para o jogador pôr uma imagem sua
    return base === ID_ARMADURA_LIVRE ? '' : base;
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
   * A arte do sistema também abre no zoom, mas por outro caminho: quem manda nela
   * é o CSS (`.arte-<id>` recorta o atlas), então em vez de uma URL o botão leva o
   * id da arte e o lightbox refaz o recorte grande.
   */
  function imgSlot(chave: string, url: string | undefined, classe: string, ro: boolean, nome = '', arte = '', enq?: any) {
    if (url) {
      // A foto é um <img> e não um fundo: assim o enquadramento é um `transform`
      // (uma escala e um deslocamento), e o mesmo elemento serve de prévia viva
      // enquanto o jogador mexe na barra de zoom.
      const emEnq = !ro && modAberto.has(chave);
      const z = Math.max(1, Math.min(ZOOM_MAX, Number(enq?.z) || 1));
      return `<div class="eq-img ${classe} tem${emEnq ? ' enq' : ''}" data-eq-quadro="${chave}">
        <img class="eq-foto" src="${escapeHtml(url)}" alt="" draggable="false" data-eq-foto="${chave}" style="--z:${z}" />
        <button type="button" class="eq-img-zoom" data-eq-zoom="${escapeHtml(url)}" data-eq-zoom-nome="${escapeHtml(nome)}" title="Ampliar" aria-label="Ampliar a imagem de ${escapeHtml(nome)}"></button>
        ${ro ? '' : `<label class="eq-img-troca" title="Trocar a imagem"><input type="file" accept="image/*" data-eq-img="${chave}" hidden /><span aria-hidden="true">✎</span><span class="sr-only">Trocar a imagem</span></label>
        <button type="button" class="eq-img-rm" data-eq-img-rm="${chave}" title="Tirar a imagem" aria-label="Tirar a imagem">×</button>`}
        ${ro ? '' : '<span class="eq-enq-dica" aria-hidden="true">arraste para deslocar</span>'}
      </div>`;
    }
    if (arte) {
      const desenho = `<span class="eq-arte arte-${escapeHtml(arte)}" role="img" aria-label="${escapeHtml(nome || 'Arte da peça')}"></span>`;
      // A arte do sistema é um recorte de atlas feito no CSS, não uma URL: o zoom
      // recebe o id da arte e reproduz o mesmo recorte em tamanho grande.
      const lupa = `<button type="button" class="eq-img-zoom" data-eq-zoom-arte="${escapeHtml(arte)}" data-eq-zoom-nome="${escapeHtml(nome)}" title="Ampliar" aria-label="Ampliar a imagem de ${escapeHtml(nome)}"></button>`;
      if (ro) return `<span class="eq-img ${classe} arte">${desenho}${lupa}</span>`;
      return `<div class="eq-img ${classe} arte">
        ${desenho}${lupa}
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
    if (refLivre(ref)) {
      const nova: any = { uid: novoUid(), ref, nome: '' };
      if (ref === REF_ARMA_LIVRE) Object.assign(nova, { dado: 1, danoBonus: 0, acerto: -2 });
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
      const campos = it.kind === 'nada' ? null : camposItem(it);
      const ajustada = campos ? temMod(it.base, p.mod, campos) : false;
      const marca = (v: 'nada' | 'habil' | 'inabil', rot: string, off = false) =>
        `<label class="eq-uso-op${papel === v ? ' on' : ''}${off ? ' off' : ''}">
          <input type="radio" name="uso-${p.uid}" data-uso="${p.uid}:${v}"${papel === v ? ' checked' : ''}${(ro || off) ? ' disabled' : ''} />
          <span>${rot}</span></label>`;
      return `<div class="eq-peca${papel !== 'nada' ? ' em-uso' : ''}${ajustada ? ' ajustado' : ''}" data-ars="${p.uid}"${ordenavel(ro, nomePeca(p))}>
        ${imgSlot(chave, p.img, it.kind === 'escudo' ? 'escudo' : 'arma', ro, nomePeca(p), idDeArte(p), p.enq)}
        <div class="eq-peca-corpo">
          <div class="eq-peca-cab">
            <div class="eq-peca-nome">${escapeHtml(nomePeca(p))}</div>
            ${(it.w?.tags || []).length ? `<div class="eq-tags">${it.w.tags.map((t: string) => `<span class="eq-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          </div>
          ${it.kind === 'escudo' ? statsBlocosEscudo(it.s) : it.w ? statsBlocos(it.w) : ''}
          ${ehLivre(p) ? improvisado(p, ro) : ''}
          <div class="eq-uso" role="radiogroup" aria-label="Como ${escapeHtml(nomePeca(p))} está empunhada">
            ${marca('nada', 'guardada')}${marca('habil', 'mão hábil')}${marca('inabil', 'mão inábil', duasMaos)}
          </div>
          ${ro ? '' : `<div class="eq-acoes">
            ${campos ? `<button type="button" class="eq-ed" data-eqm-tog="${chave}" title="Ajustar nome, valores e imagem desta peça" aria-expanded="${modAberto.has(chave)}">✎ ajustar</button>` : '<span></span>'}
            <button type="button" class="eq-rm" data-ars-rm="${p.uid}" title="Descartar esta peça" aria-label="Excluir ${escapeHtml(nomePeca(p))}">Excluir</button>
          </div>`}
        </div>
        ${campos ? painelMod(chave, it.base, p.mod, campos, ro, {
          nome: ehLivre(p) ? campoNome('ars-nome', p.uid, p.nome || '', it.base.nome, ro) : '',
          img: p.img, enq: p.enq,
        }) : ''}
      </div>`;
    }).join('');
    const adicionar = ro ? '' : `<div class="eq-add">
      <button type="button" class="btn eq-add-btn" data-ars-add>＋ Adicionar item</button>
    </div>`;
    const vazio = `<p class="muted eq-vazio">${ro ? 'Sem armas.' : 'Nenhuma arma ainda: escolha uma no catálogo.'}</p>`;
    el('eq-arsenal').innerHTML = cards || vazio;
    el('eq-arsenal-add').innerHTML = adicionar;
    queueMicrotask(enquadraTodas);
  }
  /** Descarta peças que ninguém usa e que não guardam nada do jogador (sem imagem nem ajuste). */
  function limparArsenal() {
    const usados = new Set<string>();
    (S.conjuntos || []).forEach((cj: any) => { if (cj.habil?.uid) usados.add(cj.habil.uid); if (cj.inabil?.uid) usados.add(cj.inabil.uid); });
    S.arsenal = (S.arsenal || []).filter((p: any) => usados.has(p.uid) || p.img || p.mod || (ehLivre(p) && p.nome));
  }
  /** Os quatro números da arma como blocos, no lugar da linha "5/+2/1d6/+1". */
  /**
   * Os quatro números da arma. Na arma de longe o último bloco é a Distância, e
   * não a Defesa: quem atira não guarda com o arco, e o que interessa ali é até
   * onde o tiro chega.
   */
  const statsBlocos = (w: any) => `<div class="eq-nums">
    <span class="eq-n"><b>Veloc.</b>${w.ticks}</span>
    <span class="eq-n"><b>Acerto</b>${sgn(w.acerto || 0)}</span>
    <span class="eq-n"><b>Dano</b>${danoStr(w)}</span>
    ${w.distMax
      ? `<span class="eq-n"><b>Distância</b>${w.distMax} m</span>`
      : `<span class="eq-n def"><b>Defesa</b>${sgn(w.defesaArma || 0)}</span>`}</div>`;
  const statsBlocosEscudo = (s: any) => `<div class="eq-nums">
    <span class="eq-n def"><b>Defesa</b>${sgn(s.bloqCaC || 0)}</span>
    <span class="eq-n pen"><b>Penalid.</b>${s.penalidade ? '−' + s.penalidade : '0'}</span>
    ${s.habilProjetil ? '<span class="eq-n"><b>Projétil</b>hábil</span>' : ''}</div>`;
  const statsBlocosArmadura = (a: any) => `<div class="eq-nums">
    <span class="eq-n"><b>Imp</b>${a.soak.impacto}</span>
    <span class="eq-n"><b>Cor</b>${a.soak.corte}</span>
    <span class="eq-n"><b>Perf</b>${a.soak.perfuracao}<i>N${a.resistPerf || 0}</i></span>
    <span class="eq-n pen"><b>Pen</b>${a.penalidade ? '−' + a.penalidade : '0'}</span></div>`;

  /**
   * Card de uma peça no catálogo do diálogo de adicionar. É o card da ficha sem
   * os controles: a mesma arte, os mesmos blocos de número, mais as notas do
   * catálogo — que na ficha não cabem, mas aqui são o que ajuda a escolher.
   */
  function cardCatalogo(o: { id: string; nome: string; classe: string; nums: string; notas?: string; tags?: string[] }) {
    const arte = o.id
      ? `<span class="eq-img ${o.classe} arte eqp-arte"><span class="eq-arte arte-${escapeHtml(o.id)}"></span></span>`
      : `<span class="eq-img ${o.classe} eqp-arte eqp-sem-arte"><span class="eq-img-ph"><b>＋</b>seu item</span></span>`;
    return `${arte}
      <span class="eqp-corpo">
        <span class="eq-peca-cab"><span class="eq-peca-nome">${escapeHtml(o.nome)}</span>
          ${(o.tags || []).length ? `<span class="eq-tags">${o.tags!.map((t) => `<span class="eq-tag">${escapeHtml(t)}</span>`).join('')}</span>` : ''}
        </span>
        ${o.nums}
        ${o.notas ? `<span class="eqp-nota">${escapeHtml(o.notas)}</span>` : ''}
      </span>`;
  }

  // ===== Ajuste de peça: os números do catálogo viram editáveis =====
  // Serve para a variação de qualidade (uma Espada Longa Ótima, um gambeson puído):
  // a peça continua sendo a do catálogo, só com os valores trocados na ficha.
  const modAberto = new Set<string>();   // painéis abertos, por chave ("0:habil", "arm:couro")
  function campoMod(chave: string, c: CampoEquip, base: any, mod: any, ro: boolean) {
    const v = valorCampo(base, mod, c), orig = baseCampo(base, c);
    return `<label class="eqm-c${v !== orig ? ' dif' : ''}" data-eqm-c="${chave}:${c.k}"><span>${c.rot}</span>` +
      `<input type="number" data-eqm="${chave}:${c.k}" value="${v}" min="${c.min}" max="${c.max}" step="1"${ro ? ' disabled' : ''} title="catálogo: ${c.sinal ? sgn(orig) : orig}" /></label>`;
  }
  /**
   * Enquadramento da foto do jogador: uma barra de zoom e o arrasto na própria
   * imagem. A escala 1 é a foto INTEIRA dentro da moldura, e é onde toda imagem
   * nova começa; daí para cima ela preenche o quadro e sobra o que deslocar.
   */
  const ZOOM_MAX = 4;
  function blocoEnquadra(chave: string, url: string | undefined, enq: any, ro: boolean) {
    if (ro) return '';
    if (!url) {
      return `<label class="eqm-enq eqm-enq-vazio"><span>Imagem</span>
        <input type="file" accept="image/*" data-eq-img="${chave}" hidden />
        <span class="eqm-enq-bt">escolher uma imagem…</span></label>`;
    }
    const z = Math.max(1, Math.min(ZOOM_MAX, Number(enq?.z) || 1));
    // rótulo em cima e controles embaixo: numa coluna só o card tem uns 15rem, e
    // tudo na mesma linha jogava o "reenquadrar" para fora
    return `<div class="eqm-enq">
      <span class="eqm-enq-rot">Enquadramento</span>
      <div class="eqm-enq-linha">
        <input type="range" data-enq-z="${chave}" min="100" max="${ZOOM_MAX * 100}" step="5" value="${Math.round(z * 100)}"
          aria-label="Zoom da imagem" />
        <output class="eqm-enq-v" data-enq-v="${chave}">${Math.round(z * 100)}%</output>
        <button type="button" class="eqm-reset" data-enq-reset="${chave}">reenquadrar</button>
      </div>
    </div>`;
  }
  function painelMod(chave: string, base: any, mod: any, campos: CampoEquip[], ro: boolean,
                     extra: { nome?: string; img?: string; enq?: any } = {}) {
    return `<div class="eq-mod" data-eq-pan="${chave}"${modAberto.has(chave) ? '' : ' hidden'}>` +
      `${extra.nome || ''}` +
      `${campos.map((c) => campoMod(chave, c, base, mod, ro)).join('')}` +
      `${ro ? '' : `<button type="button" class="eqm-reset" data-eqm-reset="${chave}">restaurar</button>`}` +
      `${blocoEnquadra(chave, extra.img, extra.enq, ro)}</div>`;
  }
  // o item personalizado é uma arma para todos os efeitos: mesmos campos ajustáveis
  const camposItem = (it: any) => (it.kind === 'escudo' ? CAMPOS_ESCUDO : CAMPOS_ARMA);
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
    // Atletismo não entra no levantamento: erguer o máximo é contração estática, e Atletismo
    // é mobilidade e fôlego. No arremesso ele entra, porque lá é cadeia cinética de corpo
    // inteiro, com corrida de aproximação e giro de quadril.
    const fah = Math.max(3, Math.min(40, 3 * forca + halt));
    const faa = Math.max(2, Math.min(24, 2 * forca + atl + arr));
    const maxKg = F.levantamento[fah] as number;
    // O peso máximo não é um número só: quanto mais alto o peso precisa ir, menos peso vai.
    // Do chão ao quadril é o maxKg cheio; acima da cabeça, metade; arremessar, um quarto.
    const acimaKg = maxKg * (F.levantamentoAcimaCabeca as number);
    const tetoKg = maxKg * (F.arremessoTeto as number);
    const apice = F.arremessoApice as number;
    // Alcance = C × FAA^a ÷ peso^b, e o número já supõe a melhor situação possível,
    // correndo e girando. O FAA entra com expoente porque dobrar a reserva não dobra o
    // alcance: o alcance vai com v², e a velocidade não cresce proporcional a pontos.
    const cabeca = (F.arremessoConst as number) * Math.pow(faa, F.arremessoExpFaa as number);
    const pesado = (w: number) => cabeca / Math.pow(w, F.arremessoExpMassa as number);
    // Abaixo do ápice a velocidade do braço SATURA: um objeto de 2 g e um de 50 g saem à
    // mesma velocidade, porque a inércia do próprio braço domina os dois. Dali para baixo
    // não se ganha velocidade e só se perde para o ar, então o alcance para de crescer e
    // cai devagar: cada vez que o peso cai pela metade, perde 10%.
    const leve = (w: number) => pesado(apice) * Math.pow(w / apice, F.arremessoExpLeve as number);
    // e nos últimos 20% até o teto ele desaba até zero, que é onde o objeto deixa de ser
    // arremessável e passa a ser só erguível
    const qIni = tetoKg * (F.arremessoQueda as number);
    const dist = (w: number) => {
      if (w <= 0 || w > tetoKg) return 0;
      const d = w < apice ? leve(w) : pesado(w);
      return w > qIni ? d * (tetoKg - w) / (tetoKg - qIni) : d;
    };
    // Velocidade de deslocamento com carga, em fração da normal. Ajuste sobre a literatura de
    // locomoção com carga: os quinze soldados da MOLLE 4000 andam a 96% do passo com 22% do
    // corpo nas costas, 87% com 44% e 76% com 66%, o que dá expoente 1,62 com menos de um
    // ponto percentual de resíduo; a varredura contra marcha e sprint juntos tem o mínimo em
    // 1,5. Zera no corte por construção. Em P/8 ainda se corre a 93%, em P/4 a 81%, em P/2 a
    // 46%, e a Pesada leva isso a zero em 3P/4.
    const corte = F.cargaCorte as number;
    const velFrac = (w: number) => Math.max(0, 1 - Math.pow(w / maxKg / corte, F.cargaExpoente));
    // Em metros por segundo a base é a MESMA Vel. de Corrida que os derivados mostram, com a
    // mesma penalidade de armadura: dois pontos da ficha anunciando velocidades diferentes
    // para o mesmo personagem seriam um erro visível de longe.
    const penMov = Math.floor(((empilharArmaduras(pecasArmadura()).penalidade || 0)
      + (calcConj(conjAtivo()).penSum || 0)) / 2);
    const vBase = Math.max(0, deslocamento({
      forca, destreza: A('destreza'), atletismo: atl, centelha: S.centelha,
    }).corrida - penMov);
    const vel = (w: number) => vBase * velFrac(w);
    const cMin = maxKg / 8, cLeve = maxKg / 4, cMedia = maxKg / 2, cPesada = maxKg * corte;
    const bandas = [
      { de: 0, ate: cMin, nome: 'Mínima', op: '.03' },
      { de: cMin, ate: cLeve, nome: 'Leve', op: '.06' },
      { de: cLeve, ate: cMedia, nome: 'Média', op: '.10' },
      { de: cMedia, ate: cPesada, nome: 'Pesada', op: '.15' },
      { de: cPesada, ate: maxKg, nome: 'Máxima', op: '.21' },
    ];
    const r1 = r1n;
    const fmtKg = (w: number) => (w >= 10 ? String(Math.round(w))
      : w >= 0.1 ? String(Math.round(w * 100) / 100)
      : String(Math.round(w * 1000) / 1000)).replace('.', ',');
    const kg = (n: number) => `${Math.round(n)} kg`;

    /* Os pesos da tabela, em três trechos. Na frente o ápice, 0,5 e 1 kg, que são as
       âncoras leves: a curva sobe até o ápice e despenca depois, e sem elas a tabela
       começaria já na descida. No meio oito pesos entre 1 kg e o teto, em progressão
       geométrica, encaixados num número que se diz sem gaguejar (meio quilo abaixo de 10,
       cinco quilos acima). No fim o teto exato, que é o número que decide se o objeto sai
       da mão, e antes dele três degraus dentro da PAREDE. */
    const tw = (() => {
      const limpo = (v: number) => Math.round(v * 1000) / 1000;   // lixo de ponto flutuante
      const red = (v: number) => v < 10 ? Math.round(v * 2) / 2 : Math.round(v / 5) * 5;
      const out: number[] = [];
      for (let i = 1; i <= 8; i++) {
        let v = red(Math.pow(tetoKg, i / 9));
        // se o arredondamento colidiu com o anterior, empurra um passo para cima
        while (out.includes(v) || v <= 1) v = red(v + (v < 10 ? 0.5 : 5));
        if (v < tetoKg) out.push(v);
      }
      out.sort((a, b) => a - b);
      /* Nos últimos 20% até o teto o alcance desaba até zero, e a escada geométrica passava
         por cima disso num salto só: de 75 kg direto para os 125 em que nada mais sai da
         mão. Três degraus lineares no vão mostram a queda acontecendo. O passo aqui é
         miúdo, então a casa do arredondamento acompanha o tamanho do vão. */
      const ult = out.length ? out[out.length - 1] : 1;
      const vao = tetoKg - ult;
      const res = vao >= 20 ? 5 : vao >= 4 ? 1 : vao >= 2 ? 0.5 : 0.1;
      const parede: number[] = [];
      for (let k = 1; k <= 3; k++) {
        let v = limpo(Math.round((ult + (vao * k) / 4) / res) * res);
        while ((v <= ult || parede.includes(v)) && v < tetoKg) v = limpo(v + res);
        if (v > ult && v < tetoKg && !parede.includes(v)) parede.push(v);
      }
      // o ápice vem do parâmetro, não de um 0,1 escrito à mão: é ele que ganha a linha em
      // destaque, e um ápice que mudasse de valor deixaria a tabela sem destaque nenhum
      const leves = [apice, 0.5, 1].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);
      return [...leves, ...out, ...parede, Math.round(tetoKg * 10) / 10];
    })();
    const rows = tw.map((w) => {
      const d = dist(w);
      // a última linha é o teto exato, onde o alcance é zero por construção: ali o número
      // que interessa é o peso, não a distância
      const cls = w === apice ? ' class="ap"' : d <= 0 ? ' class="lim"' : '';
      return `<tr${cls}><td>${fmtKg(w)} kg</td>`
        + `<td>${d > 0 ? `${r1(d)} metros` : 'não arremessa'}</td></tr>`;
    }).join('');
    // A unidade vai em cada valor, não no cabeçalho: a tabela é feita para ser lida de
    // relance no meio da cena, e uma linha solta ("8,6 metros") tem de se explicar sozinha.
    // larguras explícitas: sozinha, a coluna de peso encolhe até o cabeçalho quebrar em
    // duas linhas, porque os números dela são os mais curtos da tabela
    const table = `<table class="fa-tbl"><colgroup><col style="width:40%"/><col style="width:60%"/></colgroup>`
      + `<thead><tr><th>Peso</th><th>Alcance</th></tr></thead>`
      + `<tbody>${rows}</tbody></table>`;

    /* A segunda tabela anda numa régua própria. A de arremesso é geométrica, porque lá o
       que interessa acontece nos primeiros gramas; aqui é o contrário, e a régua é linear:
       todos os múltiplos de 5% de P, de 5% a 75%. Termina em 0,75 P, que é onde o
       deslocamento acaba. */
    const kg1 = (n: number) => (n >= 100 ? String(Math.round(n))
      : String(Math.round(n * 10) / 10)).replace('.', ',');
    const fracs = Array.from({ length: 15 }, (_, i) => (i + 1) / 20);
    const rowsV = fracs.map((fr) => {
      const w = maxKg * fr, v = vel(w);
      // a última é o corte: dali para cima ergue-se e segura-se, e não se anda
      return `<tr${v <= 0 ? ' class="lim"' : ''}><td>${kg1(w)} kg</td>`
        + `<td>${v > 0 ? `${r1(v)} m/s` : 'não desloca'}</td></tr>`;
    }).join('');
    const tableV = `<table class="fa-tbl"><colgroup><col style="width:40%"/><col style="width:60%"/></colgroup>`
      + `<thead><tr><th>Peso</th><th>Velocidade</th></tr></thead>`
      + `<tbody>${rowsV}</tbody></table>`;

    /* O cabeçalho em cinco linhas de forma igual: rótulo em versal, ponto-médio, e o
       conteúdo em itens de mesmo respiro. Primeiro as DUAS RESERVAS, que são de onde tudo
       sai; depois os dois grupos de números que elas geram (as alturas e as faixas de
       carga); por último a velocidade, que é a ponte para a segunda tabela.

       Entre um item e outro há um espaço de VERDADE no HTML, além da margem: só com a
       margem, copiar a linha inteira colava "500 kgacima da cabeça 250 kg". */
    const carga = cargaAtual();
    const item = (rot: string, val: string) => `<span class="fa-item">${rot} <b>${val}</b></span>`;
    const linha = (rot: string, corpo: string, grupo = false) =>
      `<div class="fa-linha${grupo ? ' fa-grupo' : ''}"><b>${rot}</b> · ${corpo}</div>`;
    const head = `<div class="fa-head">`
      + linha('Levantamento de Peso', `FAH ${fah} = Força ${forca}×3 + Halterofilismo ${halt}`)
      // Só a conta. O porquê da curva (o ápice em 100 g, a saturação abaixo dele, a queda
      // perto do teto) é matéria do capítulo de Corpo e Movimento, não da ficha: aqui o
      // jogador quer o número, e os gráficos mostram a forma a um clique.
      + linha('Distância de Arremesso', `FAA ${faa} = Força ${forca}×2 + Atletismo ${atl} + Arremesso ${arr}`)
      // As três alturas do levantamento, que é o que o jogador consulta antes de perguntar
      // se dá para jogar: do chão, acima da cabeça (metade) e arremessar (um quarto).
      + linha('Levanta', [
          item('do chão', kg(maxKg)), item('acima da cabeça', kg(acimaKg)),
          item('arremessa até', kg(tetoKg)),
        ].join(' '), true)
      + linha('Cargas', [
          item('Mínima', kg(cMin)), item('Leve', kg(cLeve)), item('Média', kg(cMedia)),
          item('Pesada', kg(cPesada)), item('Máxima', kg(maxKg)),
        ].join(' '))
      + linha('Velocidade Máxima de Corrida', `<b>${r1(vBase)} m/s</b>`, true)
      // A carga sai da soma das bolsas, do arsenal e da armadura vestida, e é a única
      // linha editável do cabeçalho: apagar o campo devolve a conta. A velocidade ao lado
      // é a mesma curva das tabelas, lida no ponto em que o personagem está agora.
      + `<div class="fa-linha"><b>Carga atual</b> · `
      + `<span class="fa-edit"><input data-fa-carga value="${escapeHtml(S.cargaAtual || '')}" `
      + `placeholder="${r1(cargaCalculada())}" inputmode="decimal" aria-label="Carga atual, em quilos"`
      + `${opts.readOnly ? ' disabled' : ''} /> kg</span> `
      + `<span class="fa-item">Velocidade atual <b data-fa-velatual>${r1(vel(carga))} m/s</b></span></div>`
      + `</div>`;
    const botoes = `<div class="fa-curvas" role="group" aria-label="Gráficos">`
      + `<button type="button" data-fa-graf="arremesso">Arremesso × Peso</button>`
      + `<button type="button" data-fa-graf="velocidade">Velocidade × Peso</button>`
      + `</div>`;
    // as duas tabelas lado a lado: são curtas e respondem a perguntas vizinhas ("vai até
    // onde?" e "ando com isso?"), então uma embaixo da outra só faria rolar
    box.innerHTML = `<div class="fa-wrap">${head}${botoes}`
      + `<div class="fa-tbls"><div class="fa-tblbox"><span class="fa-tbltit">Arremesso</span>${table}</div>`
      + `<div class="fa-tblbox"><span class="fa-tbltit">Deslocamento com carga</span>${tableV}</div></div></div>`;
    // sem redesenhar o bloco: o campo em edição não pode perder o foco, e o único número
    // que depende dele é a velocidade ao lado
    const inpCarga = box.querySelector('[data-fa-carga]') as HTMLInputElement | null;
    if (inpCarga && !opts.readOnly) inpCarga.addEventListener('input', () => {
      S.cargaAtual = inpCarga.value;
      const alvo = box.querySelector('[data-fa-velatual]');
      if (alvo) alvo.textContent = `${r1(vel(cargaAtual()))} m/s`;
      save();
    });

    // ---- o quadro, que os dois gráficos dividem ------------------------------------
    // Os dois desenham a mesma coisa: peso no X, um número no Y, faixas de carga ao fundo
    // e leitura pelo ponteiro. O que muda entre eles é a escala do X, a função e o rótulo.
    const W = 580, ml = 46, mr = 16, mt = 14, mb = 34;
    const xB = ml, xR = W - mr, pw = xR - xB;
    // marcas do eixo no menor passo redondo (1, 2, 2.5 ou 5 × 10ⁿ) que caiba em n intervalos
    const passoBom = (faixa: number, n: number) => {
      const bruto = faixa / n, e = Math.floor(Math.log10(bruto)), base = Math.pow(10, e);
      for (const m of [1, 2, 2.5, 5, 10]) if (m * base >= bruto) return m * base;
      return 10 * base;
    };
    // Teto do eixo Y, arredondado para cima até um número redondo. Sempre para cima, nunca
    // para o mais próximo, senão o ápice ficaria cortado.
    const tetoRedondo = (v: number) => v <= 0 ? 1
      : v < 10 ? Math.ceil(v)
      : v < 100 ? Math.ceil(v / 5) * 5
      : v < 500 ? Math.ceil(v / 10) * 10
      : Math.ceil(v / 50) * 50;
    const marcasY = (yMax: number) => {
      const p = passoBom(yMax, 4), out: number[] = [];
      for (let v = 0; v <= yMax - p * 0.35; v += p) out.push(Math.round(v * 100) / 100);
      out.push(yMax);
      return out;
    };
    // faixas de carga ao fundo, cada uma mais densa que a anterior, com o nome encostado na
    // borda DIREITA: em log as faixas de cima são estreitas e um rótulo centrado invadiria
    // a vizinha
    const faixasFundo = (xpos: (w: number) => number, ate: number, yB: number, ph: number) =>
      bandas.filter((b) => b.de < ate - 1e-9).map((b) => {
        const x1 = xpos(b.de), x2 = xpos(Math.min(b.ate, ate));
        if (x2 - x1 < 1) return '';
        const nome = x2 - x1 > b.nome.length * 7 + 8 ? b.nome : b.nome.slice(0, 3);
        return `<rect class="fa-band" x="${x1.toFixed(1)}" y="${mt}" width="${(x2 - x1).toFixed(1)}" height="${ph}" opacity="${b.op}"/>`
          + (b.de > 0 ? `<line class="fa-bandsep" x1="${x1.toFixed(1)}" y1="${mt}" x2="${x1.toFixed(1)}" y2="${yB}"/>` : '')
          + `<text class="fa-bandlbl" x="${(x2 - 3).toFixed(1)}" y="${mt + 11}" text-anchor="end">${nome}</text>`;
      }).join('');

    interface Graf {
      H: number; aria: string; titX: string; titY: string; rotulo: string; unid: string;
      yMax: number; xt: number[];
      xpos: (w: number) => number; wAt: (x: number) => number;
      f: (w: number) => number;
      /** pesos que a curva precisa acertar em cheio (o ápice sai em bico, não arredondado) */
      marcos?: number[];
      fundo?: (yB: number, ph: number) => string;
    }
    const desenha = (host: HTMLElement, g: Graf) => {
      const H = g.H, ph = H - mt - mb, yB = mt + ph;
      const ypos = (d: number) => yB - (g.yMax > 0 ? Math.max(0, Math.min(g.yMax, d)) / g.yMax : 0) * ph;
      // amostragem uniforme em pixels do eixo, que serve às duas escalas: dá um ponto a
      // cada ~2 px em qualquer trecho
      const N = 240;
      const am = Array.from({ length: N + 1 }, (_, i) => g.wAt(xB + (pw * i) / N));
      if (g.marcos) am.push(...g.marcos);
      am.sort((a, b) => a - b);
      const seq = am.map((w) => `${g.xpos(w).toFixed(1)},${ypos(g.f(w)).toFixed(1)}`).join(' ');
      const area = `M${xB},${yB} L${seq.split(' ').join(' L')} L${xR},${yB} Z`;
      const xticks = g.xt.map((v, i) => {
        const x = g.xpos(v), anc = i === g.xt.length - 1 ? 'end' : 'middle';
        return `<line class="grid" x1="${x.toFixed(1)}" y1="${mt}" x2="${x.toFixed(1)}" y2="${yB}"/>`
          + `<text x="${x.toFixed(1)}" y="${yB + 14}" text-anchor="${anc}">${fmtKg(v)}</text>`;
      }).join('');
      const yticks = marcasY(g.yMax).map((d) => {
        const y = ypos(d);
        return `<line class="grid" x1="${xB}" y1="${y.toFixed(1)}" x2="${xR}" y2="${y.toFixed(1)}"/>`
          + `<text x="${xB - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${r1(d)}</text>`;
      }).join('');
      host.innerHTML = `<div class="fa-chartwrap"><svg class="fa-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${g.aria}">`
        + (g.fundo ? g.fundo(yB, ph) : '') + yticks + xticks
        + `<path class="area" d="${area}"/><polyline class="curve" points="${seq}"/>`
        + `<line class="axis" x1="${xB}" y1="${mt}" x2="${xB}" y2="${yB}"/>`
        + `<line class="axis" x1="${xB}" y1="${yB}" x2="${xR}" y2="${yB}"/>`
        + `<text class="axlbl" x="${(xB + xR) / 2}" y="${H - 4}" text-anchor="middle">${g.titX}</text>`
        + `<text class="axlbl" transform="rotate(-90 11 ${mt + ph / 2})" x="11" y="${mt + ph / 2}" text-anchor="middle">${g.titY}</text>`
        + `<rect class="fa-capture" x="${xB}" y="${mt}" width="${pw}" height="${ph}" fill="transparent"/>`
        + `<g class="fa-hover" style="display:none; pointer-events:none"><line class="fa-vline" y1="${mt}" y2="${yB}"/><circle class="fa-dot" r="5"/></g>`
        + `</svg><div class="fa-tip" style="display:none"></div></div>`;
      const svgEl = host.querySelector('svg.fa-chart') as any;
      const tip = host.querySelector('.fa-tip') as any;
      const hov = host.querySelector('.fa-hover') as any;
      const vline = host.querySelector('.fa-vline') as any;
      const dot = host.querySelector('.fa-dot') as any;
      if (!svgEl || !tip || !hov || !vline || !dot) return;
      // pointer no lugar de mouse para o toque também valer; no dedo a leitura fica na
      // tela depois de soltar, senão sumiria junto com o toque
      const le = (clientX: number) => {
        const rect = svgEl.getBoundingClientRect();
        const w = g.wAt(((clientX - rect.left) / rect.width) * W);
        const cx = g.xpos(w), cy = ypos(g.f(w));
        hov.style.display = '';
        vline.setAttribute('x1', String(cx)); vline.setAttribute('x2', String(cx));
        dot.setAttribute('cx', cx.toFixed(1)); dot.setAttribute('cy', cy.toFixed(1));
        tip.innerHTML = `<b>${fmtKg(w)} kg</b><div class="fa-tipg">`
          + `<span>${g.rotulo}</span><span>${r1(g.f(w))} ${g.unid}</span></div>`;
        tip.style.display = '';
        // o balão não pode sangrar para fora do quadro nas pontas do eixo
        const px = (cx / W) * rect.width, meia = tip.offsetWidth / 2;
        tip.style.left = Math.max(meia, Math.min(rect.width - meia, px)) + 'px';
        tip.style.top = (cy / H) * rect.height + 'px';
      };
      svgEl.addEventListener('pointermove', (e: any) => le(e.clientX));
      svgEl.addEventListener('pointerdown', (e: any) => {
        // só o dedo captura: arrastar sem soltar continua lendo mesmo saindo do quadro
        if (e.pointerType !== 'mouse') { try { svgEl.setPointerCapture(e.pointerId); } catch {} }
        le(e.clientX);
      });
      svgEl.addEventListener('pointerleave', (e: any) => {
        if (e.pointerType !== 'mouse') return;
        hov.style.display = 'none'; tip.style.display = 'none';
      });
    };

    // Arremesso × Peso, com as duas escalas. A NORMAL mostra o que a mesa sente: quase todo
    // o alcance está nos primeiros quilos e a diferença entre 5 e 25 kg é quase nada. A LOG
    // mostra a forma da lei, com o ápice e os dois regimes visíveis de uma vez.
    const grafArremesso = (host: HTMLElement) => {
      let escLog = false;
      const pinta = () => {
        const wMin = Math.min(0.02, apice / 5);
        const lnW0 = Math.log(wMin), spanX = Math.log(tetoKg) - lnW0;
        const xpos = (w: number) => escLog
          ? xB + ((Math.log(Math.min(Math.max(w, wMin), tetoKg)) - lnW0) / spanX) * pw
          : xB + (Math.min(Math.max(w, 0), tetoKg) / tetoKg) * pw;
        const wAt = (x: number) => {
          const f = Math.max(0, Math.min(1, (x - xB) / pw));
          return escLog ? Math.exp(lnW0 + f * spanX) : f * tetoKg;
        };
        // décadas em log, passo redondo no normal
        const xt: number[] = [];
        if (escLog) {
          for (let e = Math.floor(Math.log10(wMin)); e <= Math.ceil(Math.log10(tetoKg)); e++) {
            const v = Math.pow(10, e);
            if (v >= wMin * 0.999 && v <= tetoKg * 1.001) xt.push(v);
          }
          xt.push(tetoKg);
        } else {
          const p = passoBom(tetoKg, 6);
          for (let v = 0; v <= tetoKg + p * 1e-6; v += p) xt.push(Math.round(v * 1000) / 1000);
        }
        host.innerHTML = `<div class="fa-curvas" role="group" aria-label="Escala do gráfico">`
          + [['lin', 'Escala normal'], ['log', 'Logarítmica']].map(([k, n]) =>
              `<button type="button" data-fa-esc="${k}" aria-pressed="${escLog === (k === 'log')}">${n}</button>`).join('')
          + `</div><div class="fa-graf"></div>`;
        desenha(host.querySelector('.fa-graf') as HTMLElement, {
          H: 330, aria: 'Distância de arremesso por peso do objeto',
          titX: 'Peso (kg)', titY: 'Arremesso (m)', rotulo: 'Alcance', unid: 'm',
          yMax: tetoRedondo(dist(apice)), xt, xpos, wAt, f: dist, marcos: [apice],
          // a marca do ápice, que é a única fronteira que o jogador precisa enxergar
          fundo: (yB, ph) => faixasFundo(xpos, tetoKg, yB, ph)
            + `<line class="fa-bandsep" x1="${xpos(apice).toFixed(1)}" y1="${mt}" x2="${xpos(apice).toFixed(1)}" y2="${yB}"/>`
            + `<text class="fa-bandlbl" x="${(xpos(apice) + 3).toFixed(1)}" y="${yB - 5}">ápice ${fmtKg(apice)} kg</text>`,
        });
        host.querySelectorAll('[data-fa-esc]').forEach((b: any) =>
          b.addEventListener('click', () => { escLog = b.getAttribute('data-fa-esc') === 'log'; pinta(); }));
      };
      pinta();
    };

    // Velocidade × Peso. Aqui o eixo vai até o peso máximo, não até o teto de arremesso: a
    // pergunta é o quanto se anda com peso, e ela continua tendo resposta muito depois de o
    // objeto ter deixado de ser arremessável.
    const grafVelocidade = (host: HTMLElement) => {
      const xpos = (w: number) => xB + (Math.min(Math.max(w, 0), maxKg) / maxKg) * pw;
      const wAt = (x: number) => Math.max(0, Math.min(1, (x - xB) / pw)) * maxKg;
      const xt: number[] = [];
      const p = passoBom(maxKg, 6);
      for (let v = 0; v <= maxKg + p * 1e-6; v += p) xt.push(Math.round(v * 1000) / 1000);
      desenha(host, {
        H: 330, aria: 'Velocidade de deslocamento por peso carregado',
        titX: 'Peso carregado (kg)', titY: 'Velocidade (m/s)', rotulo: 'Velocidade', unid: 'm/s',
        yMax: tetoRedondo(vBase), xt, xpos, wAt, f: vel,
        marcos: [cMin, cLeve, cMedia, cPesada],
        fundo: (yB, ph) => faixasFundo(xpos, maxKg, yB, ph)
          + `<text class="fa-bandlbl" x="${(xpos(cPesada) - 4).toFixed(1)}" y="${yB - 5}" text-anchor="end">para em ${fmtKg(cPesada)} kg</text>`,
      });
    };

    box.querySelectorAll('[data-fa-graf]').forEach((b: any) =>
      b.addEventListener('click', () => {
        const qual = b.getAttribute('data-fa-graf');
        const arremesso = qual === 'arremesso';
        const { corpo } = uiPainel(
          arremesso ? `Arremesso × Peso · FAA ${faa}` : `Velocidade × Peso · P ${kg(maxKg)}`,
          { classe: 'fa-painel' });
        const nota = arremesso
          ? `Alcance na melhor situação possível, correndo e girando. O eixo acaba em `
            + `<b>${kg(tetoKg)}</b>, que é o peso máximo que sai da mão.`
          : `Velocidade a partir da corrida sem carga, <b>${r1(vBase)} m/s</b>. `
            + `Acima de <b>${kg(cPesada)}</b> o peso se ergue e se segura, e não vai a lugar nenhum.`;
        corpo.innerHTML = `<div class="fa-graf-host"></div><p class="fa-graf-nota">${nota}</p>`;
        const host = corpo.querySelector('.fa-graf-host') as HTMLElement;
        if (arremesso) grafArremesso(host); else grafVelocidade(host);
      }));
  }
  // Armaduras: as peças que o personagem POSSUI, cada uma com imagem e números próprios.
  // Vestir é o que faz a peça contar; várias podem estar vestidas ao mesmo tempo (vale a
  // maior Absorção de cada modo, e as penalidades somam).
  const pecaArm = (uid: string) => (S.equip.armaduras || []).find((p: any) => p.uid === uid) || null;
  function renderArmaduras() {
    const ro = !!opts.readOnly;
    const cards = (S.equip.armaduras || []).map((p: any) => {
      const base = baseArmadura(p.base); if (!base) return '';
      const chave = `arm:${p.uid}`, a = armaduraComMod(base, p.mod);
      return `<div class="eq-peca arm${p.vestida ? ' vestida' : ''}${temMod(base, p.mod, CAMPOS_ARMADURA) ? ' ajustado' : ''}" data-arm-peca="${p.uid}"${ordenavel(ro, p.nome || base.nome)}>
        ${imgSlot(chave, p.img, 'armadura', ro, p.nome || base.nome, idDeArte(p), p.enq)}
        <div class="eq-peca-corpo">
          <div class="eq-peca-nome">${escapeHtml(p.nome || base.nome)}</div>
          <div class="eq-nums" data-arm-nums="${p.uid}">
            <span class="eq-n"><b>Imp</b>${a.soak.impacto}</span>
            <span class="eq-n"><b>Cor</b>${a.soak.corte}</span>
            <span class="eq-n"><b>Perf</b>${a.soak.perfuracao}<i>N${a.resistPerf || 0}</i></span>
            <span class="eq-n pen"><b>Pen</b>${a.penalidade ? '−' + a.penalidade : '0'}</span>
          </div>
          <button type="button" class="eq-vestir${p.vestida ? ' on' : ''}" data-arm-vestir="${p.uid}"${ro ? ' disabled' : ''}>${p.vestida ? '✓ Vestida' : 'Vestir'}</button>
          ${ro ? '' : `<div class="eq-acoes">
            <button type="button" class="eq-ed" data-eqm-tog="${chave}" title="Ajustar nome, valores e imagem desta peça" aria-expanded="${modAberto.has(chave)}">✎ ajustar</button>
            <button type="button" class="eq-rm" data-arm-rm="${p.uid}" title="Descartar esta peça" aria-label="Excluir ${escapeHtml(p.nome || base.nome)}">Excluir</button>
          </div>`}
        </div>
        ${painelMod(chave, base, p.mod, CAMPOS_ARMADURA, ro, {
          nome: campoNome('arm-nome', p.uid, p.nome || '', base.nome, ro),
          img: p.img, enq: p.enq,
        })}
      </div>`;
    }).join('');
    const adicionar = ro ? '' : `<div class="eq-add">
      <button type="button" class="btn eq-add-btn" data-arm-add>＋ Adicionar item</button>
    </div>`;
    const vazio = `<p class="muted eq-vazio">${ro ? 'Sem armaduras.' : 'Nenhuma armadura ainda: escolha uma no catálogo.'}</p>`;
    el('eq-armaduras').innerHTML = cards || vazio;
    el('eq-armaduras-add').innerHTML = adicionar;
    queueMicrotask(enquadraTodas);
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
    const p = pecaArm(uid); const base = p && baseArmadura(p.base); if (!p || !base) return;
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
      // o total fica na mesma linha do nome, e o placeholder mostra a soma das linhas: um
      // campo vazio com "10" apagado dentro diz, sem texto de ajuda, que aquilo é a conta
      // e que escrever por cima é permitido
      const soma = (b.itens || []).reduce((s: number, l: any) => s + numPeso(l.peso), 0);
      return `<div class="bolsa">
        <div class="bolsa-cab">
        <input class="bolsa-nome" data-bolsa-nome="${i}" value="${escapeHtml(b.nome)}" aria-label="Nome do campo de equipamento"${dis} />
        <span class="bolsa-peso"><input data-bolsa-peso="${i}" value="${escapeHtml(b.pesoTotal || '')}" placeholder="${r1n(soma)}" inputmode="decimal" aria-label="Peso total de ${escapeHtml(b.nome)}, em quilos"${dis} /> kg</span>
        </div>
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
    [...SECONDARY.map(([n]) => slug(n)), ...LIVRES].forEach((k) => { x2 += custoPontos('habilidadeSecundaria', undefined, S.skills2[k] || 0) + specCostSum(S.spec2[k], true); });
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
    span.querySelectorAll('.dot').forEach((d) => {
      const dd = +(d as HTMLElement).dataset.d!, acesa = dd <= val;
      d.classList.toggle('on', acesa); d.classList.toggle('free', dd <= floor);
      // a faísca acesa e a apagada são markup diferente, não classe: SMIL não se
      // desliga por CSS, então a apagada simplesmente não leva animação nenhuma
      if (kind === 'centelha' && d.querySelector('svg')?.classList.contains('apagada') === acesa)
        d.innerHTML = sparkSVG(acesa);
    });
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSpecPop(); fecharPop(); } });
  // O cartão abre no mouse e no foco. No mouse a âncora é estreita de propósito (o
  // cabeçalho da Arte, o nome do Efeito): varrer a grade de Efeitos com o ponteiro não
  // pode ficar abrindo cartão em cima de cartão. No foco vale o cartão inteiro, para
  // quem chega tabulando na caixinha de compra e não tem onde mais parar.
  const abreDaqui = (elx: HTMLElement) => (elx.dataset.efpop || elx.dataset.efbuy ? abrirEfeitoPop(elx) : abrirArtePop(elx));
  const chaveDe = (elx: HTMLElement) => (elx.dataset.efpop || elx.dataset.efbuy ? 'efeito:' : 'arte:') + (elx.dataset.efpop || elx.dataset.efbuy || elx.dataset.artepop);
  const achaMouse = (t: EventTarget | null) => (t as HTMLElement)?.closest?.('.arte-head, [data-efpop]') as HTMLElement | null;
  const achaFoco = (t: EventTarget | null) => (t as HTMLElement)?.closest?.('.arte-head, .ef-card') as HTMLElement | null;
  document.addEventListener('mouseover', (e) => { const h = achaMouse(e.target); if (h) { cancelarPop(); abreDaqui(h); } });
  document.addEventListener('mouseout', (e) => { if (achaMouse(e.target)) agendarPop(); });
  document.addEventListener('focusin', (e) => { const h = achaFoco(e.target); if (h) { cancelarPop(); abreDaqui(h); } });
  document.addEventListener('focusout', (e) => { if (achaFoco(e.target)) agendarPop(); });
  // Rolar a página não fecha o cartão: ele é posicionado em coordenadas do documento,
  // então acompanha a âncora. Fechar no scroll matava o cartão que o próprio
  // navegador tinha acabado de abrir ao trazer a Arte para a tela.
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-specpop-close]')) { closeSpecPop(); return; }
    if (specPopFor && !t.closest('.specpop') && !t.closest('.spec .sq')) closeSpecPop();
    if (popPreso && !t.closest('.arte-head, [data-efpop]') && !t.closest('.ficha-pop')) fecharPop();
    // O nome de uma Secundária livre é campo de texto: clicar nele é para escrever, não
    // para abrir o modal do traço (que continua acessível pelo resto da linha).
    const nm = t.closest<HTMLElement>('.trow .nm');
    if (nm && !(t instanceof HTMLInputElement)) { openTraitModal(nm); return; }
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
    // No toque não há hover: clicar no cabeçalho da Arte ou no nome do Efeito prende o
    // cartão. Vem antes da compra de propósito, senão clicar no nome comprava o Efeito.
    const anc = t.closest<HTMLElement>('.arte-head, [data-efpop]');
    if (anc) {
      if (popPreso && popKey === chaveDe(anc)) fecharPop();
      else { abreDaqui(anc); popPreso = true; }
      return;
    }
    // A caixinha e o resto do cartão fazem a mesma coisa: comprar. O alvo é o cartão
    // inteiro para não obrigar ninguém a mirar num quadradinho.
    const ef = t.closest<HTMLElement>('[data-efeito], [data-efbuy]');
    if (ef) {
      if (opts.readOnly) return;
      const id = ef.dataset.efeito || ef.dataset.efbuy!;
      S.efeito[id] = !S.efeito[id]; renderEfeitos(); recompute(); return;
    }
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
  // Delegado, porque renderSecondary() refaz o painel a cada mudança de bolinha. Só salva:
  // re-renderizar aqui tiraria o foco do campo no meio da digitação.
  el('secondary').addEventListener('input', (e) => {
    const inp = (e.target as HTMLElement).closest<HTMLInputElement>('[data-livre]');
    if (!inp || opts.readOnly) return;
    S.livreNome[inp.dataset.livre!] = inp.value; save();
  });
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
  function renderAll() { syncInputs(); renderRaca(); renderAttrs(); renderPower(); renderSkills(); renderSecondary(); renderCaminhos(); renderArtes(); populateEquip(); recompute(); applyDerivCol(); applySecCol(); }

  // botões
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
  const redesenhaArmas = () => { renderArsenal(); renderConjuntos(); renderDerived(); renderCombate(); renderForca(); save(); };

  // ---- Ordem das peças: arrastar pela alça, ou mover pelas setas ----
  // Guardar a ordem é guardar a ordem do ARRAY: quem lê a ficha (a mesa, o
  // rastreador) recebe as peças na sequência que o jogador escolheu.
  ativarArrasto('eq-arsenal', 'data-ars', (uids) => {
    S.arsenal = reordenar(S.arsenal || [], uids);
    redesenhaArmas();
  });
  ativarArrasto('eq-armaduras', 'data-arm-peca', (uids) => {
    S.equip.armaduras = reordenar(S.equip.armaduras || [], uids);
    renderArmaduras(); save();
  });
  el('eq-arsenal-add').addEventListener('click', async (e) => {
    if (opts.readOnly) return;
    if (!(e.target as HTMLElement).closest('[data-ars-add]')) return;
    // O personalizado vem primeiro, sem grupo: é a opção que não se procura no
    // catálogo, então não faz sentido enterrá-la no fim da lista.
    const escolha = await uiEscolher('Adicionar item', [
      { valor: REF_ARMA_LIVRE, rotulo: 'Arma personalizada', nota: 'nome e números seus',
        html: cardCatalogo({ id: '', nome: 'Arma personalizada', classe: 'arma',
          nums: '', notas: 'Fora do catálogo: você dá o nome e ajusta Velocidade, Acerto, Dano e Defesa.' }) },
      { valor: REF_ESCUDO_LIVRE, rotulo: 'Escudo personalizado', nota: 'nome e números seus',
        html: cardCatalogo({ id: '', nome: 'Escudo personalizado', classe: 'escudo',
          nums: '', notas: 'Fora do catálogo: você dá o nome e ajusta Defesa e Penalidade.' }) },
      ...ARMAS.map((w) => ({
        valor: `a:${w.id}`, rotulo: w.nome, nota: statsArma(w),
        grupo: 'Armas', busca: `${(w.tags || []).join(' ')} ${w.notas || ''}`,
        html: cardCatalogo({ id: w.id, nome: w.nome, classe: 'arma',
          nums: statsBlocos(w), notas: w.notas, tags: w.tags }),
      })),
      ...ESCUDOS.filter((s) => s.id !== 'nenhum').map((s) => ({
        valor: `e:${s.id}`, rotulo: s.nome, nota: statsEscudo(s),
        grupo: 'Escudos', busca: s.notas || '',
        html: cardCatalogo({ id: s.id, nome: s.nome, classe: 'escudo',
          nums: statsBlocosEscudo(s), notas: s.notas }),
      })),
    ], { filtro: 'Procurar arma ou escudo…', classe: 'eq-catalogo' });
    if (!escolha) return;
    const uid = novoUid();
    (S.arsenal ||= []).push(escolha === REF_ARMA_LIVRE
      ? { uid, ref: escolha, nome: '', dado: 1, danoBonus: 0, acerto: -2 }
      : escolha === REF_ESCUDO_LIVRE ? { uid, ref: escolha, nome: '' } : { uid, ref: escolha });
    // peça personalizada já nasce com o ajuste aberto: é lá que estão o nome e os
    // números, e sem eles ela não serve para nada
    if (refLivre(escolha)) modAberto.add(`ars:${uid}`);
    redesenhaArmas();
    if (refLivre(escolha)) el('eq-arsenal').querySelector<HTMLInputElement>(`input[data-ars-nome="${uid}"]`)?.focus();
  });
  el('eq-arsenal').addEventListener('change', (e) => {
    if (opts.readOnly) return;
    const alvo = e.target as HTMLElement;
    const uso = alvo.closest<HTMLInputElement>('input[data-uso]');
    if (uso) {
      const [uid, papel] = uso.dataset.uso!.split(':');
      marcarUso(uid, papel as any); redesenhaArmas(); return;
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
    // imagem nova começa enquadrada: o zoom e o deslocamento da anterior não
    // dizem nada sobre esta, e herdá-los mostraria um pedaço qualquer dela
    delete p.enq;
    renderArsenal(); renderArmaduras(); renderConjuntos(); renderForca(); save();
  }
  async function tirarImagem(chave: string) {
    const p = pecaPorChave(chave); if (!p || !p.img) return;
    const url = p.img; p.img = undefined; delete p.enq;
    renderArsenal(); renderArmaduras(); renderConjuntos(); renderForca(); save();
    const { apagarImagemItem } = await import('./imagens-item');
    void apagarImagemItem(url);
  }

  // ---- Enquadramento da foto: uma escala e um deslocamento, guardados na peça ----
  // `z` é a escala (1 = a foto inteira dentro da moldura) e `px`/`py` vão de −1 a 1:
  // a FRAÇÃO do deslocamento possível, não pixels. Guardada assim, a foto nunca sai
  // da moldura ao mudar o zoom, e o mesmo enquadramento serve em qualquer tamanho de
  // tela (o card é bem mais estreito no celular).
  const enqDe = (p: any) => ({
    z: Math.max(1, Math.min(ZOOM_MAX, Number(p?.enq?.z) || 1)),
    px: Math.max(-1, Math.min(1, Number(p?.enq?.px) || 0)),
    py: Math.max(-1, Math.min(1, Number(p?.enq?.py) || 0)),
  });
  /** Aplica o enquadramento e devolve quanto ainda dá para deslocar, em pixels. */
  function enquadraFoto(img: HTMLImageElement) {
    const p = pecaPorChave(img.dataset.eqFoto || ''); if (!p) return null;
    const { z, px, py } = enqDe(p);
    const cx = img.parentElement!.getBoundingClientRect();
    const nw = img.naturalWidth, nh = img.naturalHeight;
    img.style.setProperty('--z', String(z));
    if (!nw || !nh || !cx.width) return null;
    // `object-fit: contain`: o desenho cabe inteiro, e é daí que a escala parte
    const k = Math.min(cx.width / nw, cx.height / nh);
    // A folga é o MÓDULO da diferença entre o desenho e a moldura, e não só o
    // que passa dela: cabendo inteiro, o que sobra são as tarjas, e deslocar ali
    // é escolher se a peça encosta em cima, embaixo ou no meio. Sem o módulo, no
    // zoom 100% (que é onde toda imagem começa) o arrasto não fazia nada.
    // O translate acontece DENTRO da escala, então o limite é dividido por z.
    const maxX = Math.abs(nw * k * z - cx.width) / 2 / z;
    const maxY = Math.abs(nh * k * z - cx.height) / 2 / z;
    img.style.setProperty('--tx', `${px * maxX}px`);
    img.style.setProperty('--ty', `${py * maxY}px`);
    // sem sobra não há o que deslocar, e a dica não deve convidar para nada
    img.parentElement!.classList.toggle('desloca', maxX > 0.5 || maxY > 0.5);
    return { maxX, maxY };
  }
  const fotosDe = (box: HTMLElement) => [...box.querySelectorAll<HTMLImageElement>('.eq-foto')];
  function enquadraTodas() {
    (['eq-arsenal', 'eq-armaduras'] as const).forEach((id) => {
      const box = document.getElementById(id); if (!box) return;
      // a imagem que ainda não carregou não tem tamanho natural: quem a enquadra
      // é o ouvinte de `load` abaixo
      fotosDe(box).forEach((img) => { if (img.complete) enquadraFoto(img); });
    });
  }
  (['eq-arsenal', 'eq-armaduras'] as const).forEach((id) => {
    // `load` não sobe na árvore: só se pega na captura
    el(id).addEventListener('load', (e) => {
      const img = e.target as HTMLImageElement;
      if (img.classList?.contains('eq-foto')) enquadraFoto(img);
    }, true);
    el(id).addEventListener('change', (e) => {
      if (opts.readOnly) return;
      const inp = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-eq-img]');
      const f = inp?.files?.[0];
      if (inp && f) { void trocarImagem(inp.dataset.eqImg!, f); inp.value = ''; }
    });
    el(id).addEventListener('click', (e) => {
      if (opts.readOnly) return;
      const zerar = (e.target as HTMLElement).closest<HTMLElement>('[data-enq-reset]');
      if (zerar) {
        const chave = zerar.dataset.enqReset!, p = pecaPorChave(chave);
        if (p) { delete p.enq; save(); }
        const box = el(id);
        const faixa = box.querySelector<HTMLInputElement>(`input[data-enq-z="${chave}"]`);
        if (faixa) faixa.value = '100';
        const v = box.querySelector(`[data-enq-v="${chave}"]`); if (v) v.textContent = '100%';
        const img = box.querySelector<HTMLImageElement>(`.eq-foto[data-eq-foto="${chave}"]`);
        if (img) enquadraFoto(img);
        return;
      }
      const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-eq-img-rm]');
      if (!rm) return;
      e.preventDefault(); e.stopPropagation();   // o botão vive dentro do <label> do arquivo
      void tirarImagem(rm.dataset.eqImgRm!);
    });
    // barra de zoom: mexe na foto na hora, que é a prévia
    el(id).addEventListener('input', (e) => {
      if (opts.readOnly) return;
      const faixa = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-enq-z]');
      if (!faixa) return;
      const chave = faixa.dataset.enqZ!, p = pecaPorChave(chave); if (!p) return;
      const z = Math.max(1, Math.min(ZOOM_MAX, Number(faixa.value) / 100));
      p.enq = { ...enqDe(p), z };
      if (z === 1) delete p.enq;    // enquadrada de novo: não guarda o que é padrão
      const v = el(id).querySelector(`[data-enq-v="${chave}"]`);
      if (v) v.textContent = `${Math.round(z * 100)}%`;
      const img = el(id).querySelector<HTMLImageElement>(`.eq-foto[data-eq-foto="${chave}"]`);
      if (img) enquadraFoto(img);
      save();
    });
    // arrastar a própria foto para deslocá-la, enquanto o ajuste está aberto
    el(id).addEventListener('pointerdown', (e) => {
      if (opts.readOnly) return;
      const quadro = (e.target as HTMLElement).closest<HTMLElement>('.eq-img.enq');
      if (!quadro) return;
      const img = quadro.querySelector<HTMLImageElement>('.eq-foto'); if (!img) return;
      const p = pecaPorChave(quadro.dataset.eqQuadro!); if (!p) return;
      const lim = enquadraFoto(img); if (!lim || (!lim.maxX && !lim.maxY)) return;
      e.preventDefault();
      const ini = enqDe(p), x0 = e.clientX, y0 = e.clientY;
      quadro.classList.add('puxando');
      const mover = (ev: PointerEvent) => {
        // o ponteiro anda na tela; a foto anda dentro da escala, daí o z
        const px = lim.maxX ? ini.px + (ev.clientX - x0) / ini.z / lim.maxX : 0;
        const py = lim.maxY ? ini.py + (ev.clientY - y0) / ini.z / lim.maxY : 0;
        p.enq = { z: ini.z, px: Math.max(-1, Math.min(1, px)), py: Math.max(-1, Math.min(1, py)) };
        enquadraFoto(img);
      };
      const soltar = () => {
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
        window.removeEventListener('pointercancel', soltar);
        quadro.classList.remove('puxando');
        save();
      };
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
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
  el('eq-armaduras-add').addEventListener('click', async (e) => {
    if (opts.readOnly) return;
    if (!(e.target as HTMLElement).closest('[data-arm-add]')) return;
    const escolha = await uiEscolher('Adicionar item', [
      { valor: ID_ARMADURA_LIVRE, rotulo: 'Armadura personalizada', nota: 'nome e números seus',
        html: cardCatalogo({ id: '', nome: 'Armadura personalizada', classe: 'armadura',
          nums: '', notas: 'Peça fora do catálogo: você dá o nome e ajusta os números.' }) },
      ...ARMADURAS.filter((a) => a.id !== 'nenhuma').map((a) => ({
        valor: a.id, rotulo: a.nome, nota: statsArmadura(a),
        grupo: 'Armaduras', busca: a.notas || '',
        html: cardCatalogo({ id: a.id, nome: a.nome, classe: 'armadura',
          nums: statsBlocosArmadura(a), notas: a.notas }),
      })),
    ], { filtro: 'Procurar armadura…', classe: 'eq-catalogo' });
    if (!escolha) return;
    const uid = novoUid();
    (S.equip.armaduras ||= []).push({ uid, base: escolha, vestida: true });
    // peça personalizada já nasce com o ajuste aberto: ela vem zerada
    if (escolha === ID_ARMADURA_LIVRE) modAberto.add(`arm:${uid}`);
    renderArmaduras(); renderDerived(); renderCombate(); renderForca(); save();
  });
  el('eq-armaduras').addEventListener('input', (e) => {
    if (opts.readOnly) return;
    const nm = (e.target as HTMLElement).closest<HTMLInputElement>('input[data-arm-nome]');
    if (!nm) return;
    const p = pecaArm(nm.dataset.armNome!); if (!p) return;
    p.nome = nm.value.trim() || undefined;
    // o nome agora é texto na face do card: atualiza sem redesenhar, senão o
    // campo perderia o foco a cada tecla
    const t = nm.closest('.eq-peca')?.querySelector('.eq-peca-nome');
    if (t) t.textContent = p.nome || baseArmadura(p.base)?.nome || '';
    save();
  });
  el('eq-armaduras').addEventListener('click', async (e) => {
    if (opts.readOnly) return;
    const vest = (e.target as HTMLElement).closest<HTMLElement>('[data-arm-vestir]');
    if (vest) {
      const p = pecaArm(vest.dataset.armVestir!); if (!p) return;
      p.vestida = !p.vestida;
      renderArmaduras(); renderDerived(); renderCombate(); renderForca(); save(); return;
    }
    const rm = (e.target as HTMLElement).closest<HTMLElement>('[data-arm-rm]');
    if (!rm) return;
    const p = pecaArm(rm.dataset.armRm!); if (!p) return;
    const ok = await uiConfirmar(
      `Descartar ${p.nome || baseArmadura(p.base)?.nome || 'esta armadura'}?`,
      { titulo: 'Descartar peça', ok: 'Descartar', perigo: true },
    );
    if (!ok) return;
    S.equip.armaduras = S.equip.armaduras.filter((x: any) => x.uid !== p.uid);
    renderArmaduras(); renderDerived(); renderCombate(); renderForca(); save();
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
      const p = pecaArm(uid); const base = p && baseArmadura(p.base); if (!p || !base) return null;
      return guarda(p, base, CAMPOS_ARMADURA, () => refreshArm(uid));
    }
    if (a === 'ars') {
      const p = pecaArsenal(uid); if (!p) return null;
      const it = itemDe(p);
      // 'custom' entra aqui junto com 'arma' e 'escudo': a peça personalizada é
      // justamente a que só tem números porque alguém os ajustou
      if (it.kind === 'nada') return null;
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
        // com o ajuste aberto, a foto entra em enquadramento: ali o arrasto
        // desloca a imagem em vez de reordenar o card
        const quadro = box.querySelector<HTMLElement>(`[data-eq-quadro="${chave}"]`);
        if (quadro) quadro.classList.toggle('enq', abrir && !opts.readOnly);
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
    const pi = t.getAttribute('data-bolsa-peso');
    if (pi != null) { S.bolsas[+pi].pesoTotal = t.value; renderForca(); save(); return; }
    const cel = t.getAttribute('data-bolsa');
    if (cel != null) {
      const [i, j, campo] = cel.split(':');
      const linha = S.bolsas?.[+i]?.itens?.[+j]; if (!linha) return;
      linha[campo] = t.value; save();   // sem redesenhar: o campo em edição não pode perder o foco
      // mexer no peso de um item muda a carga, que é lida noutro bloco: aquele redesenha,
      // e a bolsa fica onde está. Só o placeholder do total espera o próximo desenho.
      if (campo === 'peso') renderForca();
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
      document.querySelectorAll<HTMLElement>('.rollv').forEach((e) => (e.style.display = 'none'));
    }
  }
  init();
}
