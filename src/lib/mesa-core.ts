// Núcleo compartilhado das páginas da mesa (o Escudo do Mestre).
//
// A mesa deixou de ser uma página só. São nove agora, e todas precisam da mesma
// abertura: conferir o Supabase, exigir login, carregar a mesa, descobrir se
// quem chegou é mestre ou jogador, desenhar o cabeçalho e as abas. Isso mora
// aqui para as páginas começarem no assunto delas.
//
// O que NÃO entra aqui: nada que dependa do bestiário. `monsters.json` tem
// quase 900 KB, e só duas páginas (Criaturas e Combate) precisam dele — elas
// importam `mesa-bestiario.ts`. O Escudo, que é a página mais aberta de todas,
// não paga esse pedágio.
import { getSupabase } from './supabase';
import { exigirLogin, supabaseConfigurado } from './auth';
import { regras } from './calc';
import { definirCrumbs } from './crumbs';
import { uiConfirmar, uiErro, uiFormulario } from './ui-dialog';
import CONDICOES from '../data/condicoes.json';

// ---------------------------------------------------------------- utilidades
const BASE = import.meta.env.BASE_URL;
export const u = (p: string) => `${BASE.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
export const norm = (s: unknown) =>
  String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const sinal = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
export const novoId = () =>
  self.crypto?.randomUUID?.() || `x${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;

export function debounce<T extends (...a: any[]) => void>(fn: T, ms = 600) {
  let t: any;
  return (...a: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/** Tipo de dano por extenso → sigla (I)/(C)/(P), igual ao bestiário. */
const DANO_AB: Record<string, string> = { impacto: '(I)', corte: '(C)', perfurante: '(P)' };
export const fmtDano = (s: unknown) =>
  String(s ?? '').replace(/\b(impacto|corte|perfurante)\b/g, (m) => DANO_AB[m]);

export const idDaMesa = () => new URLSearchParams(location.search).get('id');

/**
 * Copia um texto e avisa o que aconteceu.
 *
 * `navigator.clipboard` é negado em vários contextos (permissão recusada, aba
 * sem foco, página servida sem HTTPS). Antes isso caía num `catch {}` mudo e o
 * mestre ficava clicando num botão que não fazia nada. Falhando a via moderna,
 * o texto fica SELECIONADO na tela: o Ctrl+C continua sendo caminho, e a
 * seleção é a própria mensagem de "copie daqui".
 */
export async function copiarTexto(texto: string, origem?: HTMLElement | null, fonte?: HTMLElement | null) {
  const piscar = (t: string) => {
    if (!origem) return;
    const antes = origem.textContent;
    origem.textContent = t;
    setTimeout(() => { origem.textContent = antes; }, 1400);
  };
  try {
    await navigator.clipboard.writeText(texto);
    piscar('✓');
    return true;
  } catch {}
  const alvo = fonte;
  if (alvo && typeof getSelection === 'function') {
    const faixa = document.createRange();
    faixa.selectNodeContents(alvo);
    const sel = getSelection();
    sel?.removeAllRanges(); sel?.addRange(faixa);
    // O atalho é do teclado de quem está lendo, e não do teclado de quem escreveu.
    piscar(/Mac|iPhone|iPad/i.test(navigator.platform || '') ? '⌘C' : 'Ctrl+C');
    return false;
  }
  piscar('✕');
  return false;
}

/** Liga um <input>/<textarea> a uma coluna: digita, espera, grava, pisca "Salvo". */
export function autoSalvar(
  el: HTMLInputElement | HTMLTextAreaElement,
  gravar: (v: string) => Promise<any>,
  feedback?: HTMLElement | null,
  ms = 700,
) {
  const salvar = debounce(async () => {
    await gravar(el.value);
    if (!feedback) return;
    feedback.textContent = 'Salvo';
    setTimeout(() => (feedback.textContent = ''), 1100);
  }, ms);
  el.addEventListener('input', salvar);
}

// ------------------------------------------------------- ferimentos e barras
export interface Tier { minPct: number; maxPct: number; estado: string; penAcao: number | null; penDefesa: number | null }
export const FERIMENTOS = regras.ferimentos as Tier[];

/** Faixa de ferimento pela Vida restante. Sem PV máximo definido, devolve "Saudável". */
export function tierDe(cur: number | null | undefined, max: number | null | undefined): Tier {
  if (!max || max <= 0) return FERIMENTOS[0];
  if ((cur ?? 0) <= 0) return FERIMENTOS[FERIMENTOS.length - 1];
  const pct = Math.max(1, Math.floor(((cur as number) / max) * 100));
  return FERIMENTOS.find((f) => pct >= f.minPct && pct <= f.maxPct) || FERIMENTOS[FERIMENTOS.length - 1];
}
export const tierCls = (estado: string) => 't-' + norm(estado).replace(/\s+/g, '-');
export const pctDe = (cur: number | null | undefined, max: number | null | undefined) =>
  max && max > 0 ? Math.max(0, Math.min(100, ((cur ?? 0) / max) * 100)) : 0;
export const penTexto = (t: Tier) =>
  t.penAcao == null ? 'fora de combate'
    : (t.penAcao || t.penDefesa) ? `ação ${t.penAcao} · defesa ${t.penDefesa}` : 'sem penalidade';

/** Barra de vida com estado e cor por faixa. `chave` é o data-c usado para atualizar em lugar. */
export function hpBarHTML(cur: number | null, max: number | null, chave: string, classe = '') {
  const t = tierDe(cur, max);
  return `<div class="hpbar ${tierCls(t.estado)} ${classe}" data-c="${esc(chave)}" title="${esc(penTexto(t))}">
    <div class="hpbar-fill" style="width:${pctDe(cur, max)}%"></div>
    <span class="hpbar-txt"><span class="hp-cur">${cur ?? '—'}</span><span class="hp-sep">/</span><span class="hp-max">${max ?? '—'}</span> <span class="hp-est">· ${esc(t.estado)}</span></span>
  </div>`;
}

/** Redesenha uma barra já no DOM sem re-renderizar a lista (a largura anima). */
export function atualizarBarra(raiz: ParentNode, chave: string, cur: number, max: number) {
  const bar = raiz.querySelector<HTMLElement>(`.hpbar[data-c="${CSS.escape(chave)}"]`);
  if (!bar) return;
  const t = tierDe(cur, max);
  const fill = bar.querySelector<HTMLElement>('.hpbar-fill');
  if (fill) fill.style.width = pctDe(cur, max) + '%';
  bar.className = 'hpbar ' + tierCls(t.estado) + (bar.classList.contains('mini') ? ' mini' : '');
  bar.title = penTexto(t);
  const c = bar.querySelector<HTMLElement>('.hp-cur'); if (c) c.textContent = String(cur);
  const e = bar.querySelector<HTMLElement>('.hp-est'); if (e) e.textContent = '· ' + t.estado;
}

// ------------------------------------------------------------------ condições
export interface Condicao {
  id: string; nome: string; icone?: string; grupo?: string; cor?: string;
  acao?: number; dados?: number; defesa?: number; defesaCaC?: number; defesaDist?: number;
  ataque?: number; velocidade?: number; soak?: number; porRodada?: number;
  nota?: string; fonte?: string; foraDeCombate?: boolean; marcaOculto?: boolean;
  ate?: number | null; // tick em que expira (só na instância aplicada)
}
export const COND_GRUPOS = (CONDICOES as any).grupos as { id: string; nome: string }[];
export const COND_LISTA = (CONDICOES as any).lista as Condicao[];
export const COND: Record<string, Condicao> = Object.fromEntries(COND_LISTA.map((c) => [c.id, c]));

/** Soma o efeito de todas as condições ativas de um combatente. */
export function somarCondicoes(cs: Condicao[] | null | undefined) {
  const t = { acao: 0, dados: 0, defesa: 0, defesaCaC: 0, defesaDist: 0, ataque: 0, velocidade: 0, soak: 0, porRodada: 0, fora: false };
  for (const c of cs || []) {
    t.acao += c.acao || 0;
    t.dados += c.dados || 0;
    t.ataque += c.ataque || 0;
    t.velocidade += c.velocidade || 0;
    t.soak += c.soak || 0;
    t.porRodada += c.porRodada || 0;
    // `defesa` vale para os dois lados; CaC/Dist só ajustam o lado que citam.
    const d = c.defesa || 0;
    t.defesa += d;
    t.defesaCaC += (c.defesaCaC ?? d);
    t.defesaDist += (c.defesaDist ?? d);
    if (c.foraDeCombate) t.fora = true;
  }
  return t;
}

/** Chip visual de uma condição. `rm` liga o ✕ de remover. */
export function condChipHTML(c: Condicao, rm = false, dono = '') {
  const partes: string[] = [];
  if (c.acao) partes.push(`ação ${sinal(c.acao)}`);
  if (c.dados) partes.push(`${sinal(c.dados)}d6`);
  if (c.defesaCaC != null || c.defesaDist != null) {
    // Perto e longe diferentes cabem num par só: "def −2/+2" (perto/longe).
    if ((c.defesaCaC ?? 0) !== (c.defesaDist ?? 0)) partes.push(`def ${sinal(c.defesaCaC ?? 0)}/${sinal(c.defesaDist ?? 0)}`);
    else if (c.defesaCaC) partes.push(`def ${sinal(c.defesaCaC)}`);
  } else if (c.defesa) partes.push(`def ${sinal(c.defesa)}`);
  if (c.ataque) partes.push(`atq ${sinal(c.ataque)}`);
  if (c.velocidade) partes.push(`vel ${sinal(c.velocidade)}`);
  if (c.soak) partes.push(`abs ${sinal(c.soak)}`);
  if (c.porRodada) partes.push(`−${c.porRodada}/rodada`);
  const dica = [c.nota, partes.length ? `(${partes.join(' · ')})` : '',
    c.defesaCaC != null && (c.defesaCaC ?? 0) !== (c.defesaDist ?? 0) ? '— o par é perto/longe.' : '',
  ].filter(Boolean).join(' ');
  return `<span class="cond cond-${esc(c.cor || 'neutro')}" title="${esc(dica)}">
    ${c.icone ? `<span class="cond-i">${esc(c.icone)}</span>` : ''}<span class="cond-n">${esc(c.nome)}</span>${partes.length ? `<span class="cond-m">${esc(partes[0])}</span>` : ''}${rm ? `<button class="cond-x" data-cond="${esc(c.id)}" data-dono="${esc(dono)}" title="Remover condição" type="button">✕</button>` : ''}
  </span>`;
}

// -------------------------------------------------------------- retratos
/**
 * URL de exibição de uma imagem. O caminho pode ser três coisas:
 *   http(s)://…            → link externo, usado como está
 *   bestiario/x.jpg        → arte estática do site
 *   <uuid>/arquivo.png     → objeto num bucket privado, precisa de URL assinada
 * As assinaturas valem uma hora e ficam em cache: uma lista de vinte fichas
 * pedindo a mesma pasta não vira vinte chamadas.
 */
const CACHE_URL = new Map<string, string>();
export async function urlImagem(sb: any, caminho: string | null | undefined, bucket = 'personagens'): Promise<string | null> {
  if (!caminho) return null;
  if (/^https?:\/\//i.test(caminho)) return caminho;
  if (/^(bestiario|imagens|assets)\//.test(caminho)) return u(caminho);
  const chave = bucket + '|' + caminho;
  const posto = CACHE_URL.get(chave);
  if (posto) return posto;
  try {
    const { data } = await sb.storage.from(bucket).createSignedUrl(caminho, 3600);
    if (data?.signedUrl) { CACHE_URL.set(chave, data.signedUrl); return data.signedUrl; }
  } catch {}
  return null;
}

/** Assina um lote de caminhos de uma vez (uma ida ao servidor por bucket). */
export async function urlsImagens(sb: any, caminhos: (string | null | undefined)[], bucket = 'personagens') {
  const mapa: Record<string, string> = {};
  const faltam: string[] = [];
  for (const c of caminhos) {
    if (!c) continue;
    if (/^https?:\/\//i.test(c)) { mapa[c] = c; continue; }
    if (/^(bestiario|imagens|assets)\//.test(c)) { mapa[c] = u(c); continue; }
    const posto = CACHE_URL.get(bucket + '|' + c);
    if (posto) { mapa[c] = posto; continue; }
    faltam.push(c);
  }
  if (faltam.length) {
    try {
      const { data } = await sb.storage.from(bucket).createSignedUrls([...new Set(faltam)], 3600);
      for (const r of data || []) {
        if (r?.signedUrl && r.path) { mapa[r.path] = r.signedUrl; CACHE_URL.set(bucket + '|' + r.path, r.signedUrl); }
      }
    } catch {}
  }
  return mapa;
}

/**
 * Sobe uma imagem de compêndio e devolve a URL pública.
 *
 * Vai para o bucket `itens`, que é de leitura pública e escrita restrita à
 * pasta do dono. Escolha deliberada: o retrato de um NPC precisa aparecer para
 * os jogadores quando o mestre libera a entrada, e o bucket privado da mesa só
 * libera arquivo que esteja registrado na tabela `arquivos`. Um desenho de NPC
 * não é segredo; o que é segredo é o TEXTO, e esse continua atrás da RLS.
 */
export async function subirImagemPublica(sb: any, userId: string, file: File, pasta: string): Promise<string | null> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const caminho = `${userId}/${pasta}/${novoId()}.${ext}`;
  const { error } = await sb.storage.from('itens').upload(caminho, file, { contentType: file.type, upsert: true });
  if (error) return null;
  const { data } = sb.storage.from('itens').getPublicUrl(caminho);
  return data?.publicUrl || null;
}

/**
 * Retrato circular. Sem imagem, cai na inicial do nome sobre um fundo tirado do
 * próprio nome — assim dois NPCs sem arte não ficam iguais na lista.
 */
export function avatarHTML(nome: string, src?: string | null, extra = '') {
  const inicial = (String(nome || '?').trim()[0] || '?').toUpperCase();
  const matiz = [...String(nome || '')].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);
  return src
    ? `<span class="av ${extra}"><img src="${esc(src)}" alt="" loading="lazy" /></span>`
    : `<span class="av av-vazio ${extra}" style="--av-h:${matiz}"><span class="av-i cinzel">${esc(inicial)}</span></span>`;
}

// ------------------------------------------------------------------- as abas
export { ABAS } from './mesa-abas';
import { ABAS as ABAS_L } from './mesa-abas';

// -------------------------------------------------------------- abrir a mesa
export interface CtxMesa {
  sb: any;
  user: any;
  mesa: any;
  ehMestre: boolean;
  id: string;
  /** Recarrega o cabeçalho depois de editar o nome da mesa. */
  renomear: (nome: string, descricao: string) => void;
}

const elo = (id: string) => document.getElementById(id);
function falhar(txt: string) {
  const c = elo('mesa-carregando'); if (c) c.hidden = true;
  const e = elo('mesa-erro'); if (e) { e.hidden = false; e.textContent = txt; }
}

/**
 * Abre a mesa para a aba informada. Devolve null (e já desenhou o aviso na
 * tela) quando não dá para seguir: Supabase desligado, sem id, sem login,
 * mesa inexistente ou sem acesso.
 */
export async function abrirMesa(aba: string): Promise<CtxMesa | null> {
  if (!supabaseConfigurado) {
    const c = elo('mesa-carregando'); if (c) c.hidden = true;
    const s = elo('mesa-setup'); if (s) s.hidden = false;
    return null;
  }
  const id = idDaMesa();
  if (!id) { falhar('Mesa não informada. Volte para Mesas / Fichas e escolha uma.'); return null; }

  const user = await exigirLogin(BASE);
  if (!user) return null;

  const sb = getSupabase();
  const { data: mesa, error } = await sb.from('mesas').select('*').eq('id', id).maybeSingle();
  if (error) { falhar('Erro: ' + error.message); return null; }
  if (!mesa) { falhar('Mesa não encontrada ou você não tem acesso a ela.'); return null; }

  // Mestre é quem criou a mesa OU quem foi promovido: o mesmo critério da
  // função eh_mestre() do banco, senão a tela liberaria botão que a RLS nega.
  let ehMestre = mesa.mestre_id === user.id;
  if (!ehMestre) {
    const { data: eu } = await sb.from('mesa_membros').select('papel').eq('mesa_id', id).eq('user_id', user.id).maybeSingle();
    ehMestre = eu?.papel === 'mestre';
  }

  const c = elo('mesa-carregando'); if (c) c.hidden = true;
  const topo = elo('mesa-topo'); if (topo) topo.hidden = false;
  const corpo = elo('mesa-corpo'); if (corpo) corpo.hidden = false;
  document.body.classList.add('area-mesa', ehMestre ? 'sou-mestre' : 'sou-jogador');

  const nome = elo('mesa-nome'); if (nome) nome.textContent = mesa.nome;
  const desc = elo('mesa-desc'); if (desc) desc.textContent = mesa.descricao || '';
  const papel = elo('mesa-papel');
  if (papel) { papel.textContent = ehMestre ? 'Mestre' : 'Jogador'; papel.classList.add(ehMestre ? 'p-mestre' : 'p-jogador'); }

  // As abas nascem no HTML (para não piscar) e recebem o ?id= aqui.
  const atual = ABAS_L.find((a) => a.id === aba);
  document.querySelectorAll<HTMLAnchorElement>('.mesa-abas a[data-slug]').forEach((a) => {
    a.href = u(a.dataset.slug!) + '?id=' + id;
  });
  const voltar = elo('mesa-voltar') as HTMLAnchorElement | null;
  if (voltar) voltar.href = u('mesas');
  definirCrumbs([
    { label: 'Mesas / Fichas', href: u('mesas') },
    { label: mesa.nome, href: aba === 'escudo' ? undefined : u('mesa') + '?id=' + id },
    ...(aba === 'escudo' ? [] : [{ label: atual?.nome || '' }]),
  ]);
  document.title = `${atual && aba !== 'escudo' ? atual.nome + ' · ' : ''}${mesa.nome} — Centelha`;

  const renomear = (n: string, d: string) => {
    mesa.nome = n; mesa.descricao = d;
    if (nome) nome.textContent = n;
    if (desc) desc.textContent = d;
  };
  const ctx: CtxMesa = { sb, user, mesa, ehMestre, id, renomear };
  // O cabeçalho é o mesmo nas nove abas, e o código de convite é a coisa que o
  // mestre mais procura: ligar aqui garante que ele esteja em TODAS, e não só
  // na que lembrou de chamar a função.
  await ligarCabecalho(ctx);
  return ctx;
}

/** Liga os botões do cabeçalho: convite, novo código, editar a mesa, sair dela. */
export async function ligarCabecalho(ctx: CtxMesa) {
  const { sb, mesa, ehMestre, id, user } = ctx;
  if (ehMestre) {
    const box = elo('mesa-convite'); if (box) box.hidden = false;
    const cod = elo('mesa-codigo'); if (cod) cod.textContent = mesa.codigo_convite;
    // Copiar clicando no botão OU no próprio código: o código tem cara de
    // clicável, e ninguém procura o ícone ao lado quando o alvo óbvio é o texto.
    const copiar = () => copiarTexto(cod?.textContent || '', elo('mesa-copiar'), cod);
    elo('mesa-copiar')?.addEventListener('click', copiar);
    cod?.addEventListener('click', copiar);
    elo('mesa-regen')?.addEventListener('click', async () => {
      if (!await uiConfirmar('Gerar um novo código? O código atual deixa de funcionar.', { titulo: 'Novo código de convite', ok: 'Gerar novo' })) return;
      const { data, error } = await sb.rpc('regenerar_codigo', { p_mesa: id });
      if (error) return uiErro('Erro: ' + error.message);
      if (cod) cod.textContent = data;
    });
    const ed = elo('mesa-editar') as HTMLButtonElement | null;
    if (ed) {
      ed.hidden = false;
      ed.addEventListener('click', async () => {
        const v = await uiFormulario('Editar mesa', [
          { nome: 'nome', rotulo: 'Nome da mesa', valor: mesa.nome, obrigatorio: true },
          { nome: 'descricao', rotulo: 'Descrição', valor: mesa.descricao || '', tipo: 'longo', placeholder: 'Cenário, tom, horário das sessões…' },
        ]);
        if (!v) return;
        const nome = v.nome.trim() || mesa.nome;
        const { error } = await sb.from('mesas').update({ nome, descricao: v.descricao }).eq('id', id);
        if (error) return uiErro('Erro: ' + error.message);
        ctx.renomear(nome, v.descricao);
      });
    }
  } else {
    const sair = elo('mesa-sair') as HTMLButtonElement | null;
    if (sair) {
      sair.hidden = false;
      sair.addEventListener('click', async () => {
        if (!await uiConfirmar('Sair desta mesa? Seus personagens deixam de ficar ligados a ela.', { titulo: 'Sair da mesa', ok: 'Sair', perigo: true })) return;
        await sb.from('mesa_membros').delete().eq('mesa_id', id).eq('user_id', user.id);
        location.href = u('mesas');
      });
    }
  }
}

// -------------------------------------------------- tolerância a banco antigo
/**
 * Diz se o erro veio de uma coluna ou tabela que a migração 11 cria. As páginas
 * usam isto para mostrar "rode a migração" em vez de um erro cru do Postgres,
 * e para seguir funcionando com o que já existe.
 */
export const bancoAntigo = (e: any) =>
  !!e && /(column|relation).*(does not exist)|mesa_codex|mesa_sessoes|mesa_relogios|condicoes|codex_id/i.test(e.message || '');

export function avisoMigracao(alvo: HTMLElement, oque: string) {
  alvo.innerHTML = `<div class="aviso"><strong>${esc(oque)} ainda não existe no banco.</strong>
    <p class="muted">Rode <code>supabase/migracao-11.sql</code> no SQL Editor do Supabase para ligar esta aba.</p></div>`;
}

// ----------------------------------------------------------------- perfis
const CACHE_NOMES: Record<string, string> = {};
export async function nomesDe(sb: any, ids: (string | null | undefined)[]): Promise<Record<string, string>> {
  const uniq = [...new Set(ids.filter(Boolean) as string[])].filter((i) => !(i in CACHE_NOMES));
  if (uniq.length) {
    const { data } = await sb.from('profiles').select('id, nome').in('id', uniq);
    for (const p of data || []) CACHE_NOMES[p.id] = p.nome;
    for (const i of uniq) CACHE_NOMES[i] ??= '';
  }
  return { ...CACHE_NOMES };
}
