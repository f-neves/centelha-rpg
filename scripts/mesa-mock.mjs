// Um Supabase de mentira, para a mesa poder ser testada.
//
// O PROBLEMA
// As nove abas da mesa exigem conta, mesa e permissão antes de desenharem uma
// linha, e é por isso que a aba mais complexa do projeto (o Grid, com 4.700
// linhas) não tinha um único teste automatizado. O smoke do navegador cobria
// o livro e a ficha; o tabuleiro, ninguém.
//
// A SAÍDA
// `astro.bancada.mjs` troca `@supabase/supabase-js` por este arquivo. O cliente
// devolvido tem a mesma cara do de verdade, responde com uma cena montada na
// hora, e ANOTA toda consulta em `window.__SB.log`. Com isso dá para:
//
//   · abrir /mesa/grid sem login e sem tocar no banco de produção;
//   · montar cenas do tamanho que se quiser (?bench=30&cols=40&rows=30&nevoa=1);
//   · contar as idas ao banco por ação, que é como se enxerga um N+1.
//
// O que ele NÃO é: uma imitação fiel do Postgres. Não há RLS, não há view, não
// há erro. Ele serve para provar que a TELA funciona; o que o banco decide se
// prova no banco.
//
// Toda consulta desconhecida devolve lista vazia, e não erro, de propósito: assim
// a página segue o caminho normal em vez do caminho de "rode a migração".

const P = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
const N_COMB = parseInt(P.get('bench') || '12', 10);
const COLS = parseInt(P.get('cols') || '24', 10);
const ROWS = parseInt(P.get('rows') || '16', 10);
const NEVOA = P.get('nevoa') === '1';
const POSTOS = parseInt(P.get('postos') || String(N_COMB), 10);

const UID = '00000000-0000-4000-8000-000000000001';
const MESA = P.get('id') || '00000000-0000-4000-8000-0000000000aa';
const ARENA = '00000000-0000-4000-8000-0000000000bb';
const ENC = '00000000-0000-4000-8000-0000000000cc';

// Ids reais do bestiário: o porte deles decide o tamanho da peça no tabuleiro, e
// uma cena só de médios não exercitaria o empilhamento nem a regra de ocupação.
const MONS = ['mon-aasimar', 'mon-aguia-gigante', 'mon-aboleth'];

const offsetParaAxial = (col, row) => ({ q: col - Math.floor(row / 2), r: row });

const COMBS = [];
for (let i = 0; i < N_COMB; i++) {
  const ehPC = i < Math.min(4, N_COMB);
  COMBS.push({
    id: `c${String(i).padStart(3, '0')}`,
    encontro_id: ENC,
    nome: ehPC ? `Herói ${i + 1}` : `Criatura ${i + 1}`,
    tipo: ehPC ? 'pc' : 'criatura',
    grupo: ehPC ? 'aliado' : 'inimigo',
    monstro_id: ehPC ? null : MONS[i % MONS.length],
    personagem_id: null,
    pv_max: 40, pv_atual: 40 - (i % 7) * 3,
    mana_max: ehPC ? 8 : null, mana_atual: ehPC ? 8 - (i % 3) : null,
    tick: i % 4, iniciativa: 20 - i,
    condicoes: i % 3 === 0 ? [{ id: 'cego' }] : [],
    ativo: true, oculto: false, imagem: null, retrato: null,
  });
}

const TOKENS = [];
for (let i = 0; i < Math.min(POSTOS, COMBS.length); i++) {
  const col = (i * 3) % COLS;
  const row = Math.floor((i * 3) / COLS) % ROWS;
  const h = offsetParaAxial(col, row);
  TOKENS.push({
    arena_id: ARENA, combatente_id: COMBS[i].id, q: h.q, r: h.r,
    // Data fixa: o carimbo ordena a pilha de quem divide a casa, e um
    // `new Date()` aqui faria a cena mudar de desenho a cada volta do teste.
    movido_em: new Date(1700000000000 + i * 1000).toISOString(),
  });
}

const LOG = Array.from({ length: 40 }, (_, i) => ({
  id: `l${i}`, ts: new Date(1700000000000 + i * 60000).toISOString(),
  txt: `Linha de registro ${i + 1}`, ord: i,
}));

const ARENAS = [{
  id: ARENA, mesa_id: MESA, nome: 'Bancada', cols: COLS, rows: ROWS, escala_m: 1,
  ativa: true, ordem: 0, criado_em: '2026-01-01T00:00:00Z',
  fundo: {}, fundo_path: null, fundo_url: null, grade: {},
  nevoa: NEVOA ? { ligada: true, visao: 6, luz: 2, claros: [], explorado: [] } : {},
  trilha: {}, log: LOG,
}];

const TABELAS = {
  mesas: [{
    id: MESA, nome: 'Mesa de bancada', descricao: 'bancada de teste',
    mestre_id: UID, codigo_convite: 'BENCH1', revelar: {},
  }],
  mesa_arenas: ARENAS,
  arena_visao: ARENAS,
  encontros: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: 0, nome: 'Cena' }],
  encontro_visao: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: 0, nome: 'Cena' }],
  combatentes: COMBS,
  combate_visao: COMBS,
  arena_tokens: TOKENS,
  token_visao: TOKENS,
  arena_efeitos: [],
  efeito_visao: [],
  arena_log_visao: LOG,
  personagens: [],
  profiles: [],
  mesa_membros: [],
  arquivos: [],
  mesa_criaturas: [],
  mesa_codex: [],
  mesa_notas: [],
  mesa_sessoes: [],
  mesa_relogios: [],
};

const REG = { log: [] };
const anotar = (tipo, alvo) => REG.log.push({ tipo, alvo, t: Date.now() });

function encadeavel(tabela, verbo, valor) {
  const o = {
    select: () => o, eq: () => o, in: () => o, order: () => o, limit: () => o,
    neq: () => o, is: () => o, not: () => o, or: () => o, gte: () => o, lte: () => o,
    maybeSingle: () => { o.__um = true; return o; },
    single: () => { o.__um = true; return o; },
    then: (ok, ko) => {
      anotar(verbo, tabela);
      const dado = typeof valor === 'function' ? valor() : valor;
      const r = { data: o.__um ? (Array.isArray(dado) ? dado[0] ?? null : dado) : dado, error: null };
      return Promise.resolve(r).then(ok, ko);
    },
  };
  return o;
}

export function createClient() {
  const canal = {
    on: () => canal,
    subscribe: (cb) => { setTimeout(() => cb && cb('SUBSCRIBED'), 0); return canal; },
    send: () => { anotar('broadcast', 'canal'); return Promise.resolve('ok'); },
    track: () => Promise.resolve('ok'),
    presenceState: () => ({}),
    unsubscribe: () => Promise.resolve('ok'),
  };
  const sb = {
    auth: {
      getUser: async () => ({ data: { user: { id: UID, email: 'bancada@local', user_metadata: { nome: 'Bancada' } } }, error: null }),
      getSession: async () => ({ data: { session: { user: { id: UID } } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => ({ error: null }),
    },
    from: (tab) => ({
      select: () => encadeavel(tab, 'select', () => TABELAS[tab] ?? []),
      insert: (l) => encadeavel(tab, 'insert', () => (Array.isArray(l) ? l : [l])),
      upsert: (l) => encadeavel(tab, 'upsert', () => (Array.isArray(l) ? l : [l])),
      update: () => encadeavel(tab, 'update', () => []),
      delete: () => encadeavel(tab, 'delete', () => []),
    }),
    rpc: (nome) => encadeavel('rpc:' + nome, 'rpc', () => []),
    channel: () => canal,
    removeChannel: () => Promise.resolve('ok'),
    storage: {
      from: () => ({
        createSignedUrl: async () => ({ data: null, error: null }),
        createSignedUrls: async () => ({ data: [], error: null }),
        upload: async () => ({ data: null, error: { message: 'bancada: não sobe arquivo' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  };
  if (typeof window !== 'undefined') window.__SB = REG;
  return sb;
}

export default { createClient };
