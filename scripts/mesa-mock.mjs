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
// O sistema de tempo da mesa de bancada. `pgr` de propósito: é o caminho novo,
// e o que o smoke precisa exercitar. `?tempo=normal` volta ao de sempre.
const TEMPO = P.get('tempo') === 'normal' ? 'normal' : 'pgr';
// DE QUE CADEIRA SE OLHA. `?papel=jogador` tira o mestre do lugar e devolve a
// mesa como ela chega para quem só tem um personagem: sem os botões do relógio,
// sem o menu que mexe na cena, e com a `acao` alheia MASCARADA como a
// `combate_visao` da migração 27 a mascara (o tempo é público, a intenção não).
// Sem isto não havia como olhar a tela do jogador: a bancada sempre foi mestre,
// e metade do desenho novo do tempo é justamente o que ele vê.
const PAPEL = P.get('papel') === 'jogador' ? 'jogador' : 'mestre';

const UID = '00000000-0000-4000-8000-000000000001';
/** Quem manda na mesa quando quem olha é jogador. */
const OUTRO_UID = '00000000-0000-4000-8000-0000000000ff';
const MESA = P.get('id') || '00000000-0000-4000-8000-0000000000aa';
const ARENA = '00000000-0000-4000-8000-0000000000bb';
const ENC = '00000000-0000-4000-8000-0000000000cc';

// Ids reais do bestiário: o porte deles decide o tamanho da peça no tabuleiro, e
// uma cena só de médios não exercitaria o empilhamento nem a regra de ocupação.
const MONS = ['mon-aasimar', 'mon-aguia-gigante', 'mon-aboleth'];

const offsetParaAxial = (col, row) => ({ q: col - Math.floor(row / 2), r: row });

// Uma ficha de mentira, só com o que as Artes precisam: de onde saem as Artes,
// a Centelha e os Efeitos comprados. Sem ela NINGUÉM na bancada conjura (nenhum
// dos 309 blocos do bestiário declara `arte`), e a conjuração era a única parte
// grande do Grid que não dava para exercitar aqui.
//
// `efeito` fica nulo de propósito: nulo é "alcança o que a Arte comporta", que é
// a regra da criatura, e com ele a lista de Efeitos vem cheia sem ter de listar
// id por id. O improviso continua no topo, como no jogo.
const FICHA_PC = {
  centelha: 3,
  arte: { fogo: 5, terra: 4, vento: 5, protecao: 3, cura: 2 },
  efeito: null,
};

/**
 * Uma ação no ar a cada três peças, e as três fases representadas: uma ainda
 * montando o gesto, uma golpeando agora, uma se recompondo. Sem isso a fita e o
 * anel de Golpe nunca seriam desenhados na bancada.
 *
 * `desde` é o Tick da declaração, e o abortar precisa dele para dizer quantos
 * Ticks foram para o lixo.
 */
const ACAO = Array.from({ length: N_COMB }, (_, i) => (
  i % 3 === 0 ? {}
    : i % 3 === 1
      ? { golpes: [(i % 4) + 2], livre: (i % 4) + 6, desde: 0, tipo: 'simples', arma: 'Espada Longa', pressao: i % 2 }
      : { golpes: [i % 4], livre: (i % 4) + 4, desde: 0, tipo: 'dupla', arma: 'Adaga', pressao: 0 }
));

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
    personagem_id: ehPC ? `p${String(i).padStart(3, '0')}` : null,
    pv_max: 40, pv_atual: 40 - (i % 7) * 3,
    mana_max: ehPC ? 8 : null, mana_atual: ehPC ? 8 - (i % 3) : null,
    tick: ACAO[i].livre ?? (i % 4), iniciativa: 20 - i,
    // O tick de quem tem ação no ar É o fim do ciclo dela: é a invariante que o
    // rastreador mantém (`avancarTick` grava os dois juntos), e a bancada tem de
    // respeitá-la, senão abortar não muda número nenhum e o teste mente.
    acao: ACAO[i],
    // UM ARQUEIRO NA CENA. A ficha da bancada não tem equipamento, então todo
    // mundo cai no punho, e o ramo de DISTÂNCIA da folha da ação (as quatro
    // faixas de alcance) nunca era desenhado. `dados` é o mesmo campo que o
    // mestre usa para dar números próprios a uma peça.
    // Besta pequena e não arco: o alcance livre dela é 40 m, e o tabuleiro da
    // bancada tem 40 hexágonos de largura. Com o arco (livre 83 m) nenhuma
    // distância do mapa sairia do livre, e a faixa nunca seria desenhada.
    dados: i === 1
      ? { arma: 'besta-pequena', ataque: '3d6 +2', dano: '1d6 +1 (P)' }
      : undefined,
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

/**
 * A cena como o JOGADOR a recebe, imitando a `combate_visao` da migração 27.
 *
 * Só o pedaço que interessa aqui: a agenda do gesto (`golpes`, `livre`) é
 * pública, porque é o que se vê olhando para o sujeito; a ARMA e o ALVO só
 * chegam para quem é dono da peça. Saber que o ogro está montando um gesto é
 * leitura de mesa; saber que ele está montando contra o mago é o que se compra
 * prestando atenção.
 *
 * Não é o Postgres: aqui "meu" é o primeiro PC, e não há RLS por trás.
 */
const MEU_PC = 'p000';
const paraJogador = (c) => {
  const meu = c.personagem_id === MEU_PC;
  if (meu || !c.acao) return c;
  const { arma, alvo, ...resto } = c.acao;
  return { ...c, acao: resto };
};

// O BALDE DE ARQUIVOS DA BANCADA: caminho para conteúdo, em memória.
// Os dois PNGs abaixo têm dez por seis e seis por dez pixels. Um mapa de
// verdade não caberia aqui e não provaria mais nada: o que a tela precisa ler
// da imagem é o tamanho natural dela.
const PNG_DEITADO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAAdElEQVR4nAXBwQAAIBBFwQ5BhPAOwSzEQnyIhViIDxFEECE0MxRU0IGDE9zgBTNYwQ6Gkko6cXKSm7xkJivZyZAo0cLiiCuemGKJLYaKKrpwcYpbvGIWq9jFUFNNN25Oc5vXzGY1uxkyZdrYHHPNM9Mss80HifJHEa5LbAkAAAAASUVORK5CYII=';
const PNG_EM_PE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAAeklEQVR4nAXBIQEAIAwAwSUgx0J8iGn09PQ0epoQhCAEIQiB4k60Q8c63slOdUQDAgs8yKAC0QEDG/ggBzUQnTCxiU9yUhPRBQtb+CIXtRDdsLGNb3JTG9EDBzv4IQ91EL1wsYtf8lIX0QcPe/gjH/UQbdCwhjeyUY0PfB1HWV1jrxEAAAAASUVORK5CYII=';
const BALDE = new Map([
  [`${MESA}/mapas/1-deitado.png`, PNG_DEITADO],
  [`${MESA}/mapas/2-em-pe.png`, PNG_EM_PE],
]);

const TABELAS = {
  mesas: [{
    id: MESA, nome: 'Mesa de bancada', descricao: 'bancada de teste',
    mestre_id: PAPEL === 'mestre' ? UID : OUTRO_UID, codigo_convite: 'BENCH1', revelar: {},
    combate: { sistema: TEMPO, marcacao: 'fita' },
  }],
  mesa_arenas: ARENAS,
  arena_visao: ARENAS,
  encontros: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: 0, nome: 'Cena' }],
  encontro_visao: [{ id: ENC, mesa_id: MESA, ativo: true, tick_atual: 0, nome: 'Cena' }],
  combatentes: COMBS,
  combate_visao: PAPEL === 'jogador' ? COMBS.map(paraJogador) : COMBS,
  arena_tokens: TOKENS,
  token_visao: TOKENS,
  arena_efeitos: [],
  efeito_visao: [],
  arena_log_visao: LOG,
  personagens: COMBS.filter((c) => c.personagem_id)
    .map((c) => ({ id: c.personagem_id, imagem_path: null, ficha: { ...FICHA_PC, nome: c.nome } })),
  profiles: [],
  mesa_membros: [],
  // OS DOIS MAPAS DA BANCADA, um deitado e um em pé.
  //
  // Miúdos de propósito (dez por seis pixels e seis por dez): o que se prova
  // aqui é a MEDIDA e o encanamento, e não a beleza da arte. O mapa em pé é o
  // caso que existe na vida real, que é a arte que subiu na orientação errada
  // e precisa deitar sem que ninguém abra editor de imagem.
  arquivos: [
    { id: 'aq-mapa-1', mesa_id: MESA, nome: 'A ponte, deitada', categoria: 'mapa',
      bucket: 'mesa', tipo: 'image/png', storage_path: `${MESA}/mapas/1-deitado.png` },
    { id: 'aq-mapa-2', mesa_id: MESA, nome: 'A torre, em pé', categoria: 'mapa',
      bucket: 'mesa', tipo: 'image/png', storage_path: `${MESA}/mapas/2-em-pe.png` },
  ],
  mesa_criaturas: [],
  mesa_codex: [],
  mesa_notas: [],
  mesa_sessoes: [],
  mesa_relogios: [],
};

const REG = { log: [] };
const anotar = (tipo, alvo) => REG.log.push({ tipo, alvo, t: Date.now() });

/**
 * O `insert` GUARDA, e carimba um id em quem não trouxe.
 *
 * Devolver a linha e esquecê-la parece inofensivo e não é: quem insere quase
 * sempre recarrega logo depois, e a leitura vinha vazia, então nada do que a
 * bancada criava aparecia na tela. Pior, a linha voltava SEM id (no banco quem
 * dá o id é o Postgres), e o desenho quebrava ao usá-lo como semente do efeito
 * visual. Guardar e carimbar é o mínimo para o caminho de escrita ser exercitável.
 *
 * Contador fixo em vez de sorteio: a bancada tem de dar a mesma cena a cada
 * volta, e `Math.random()` faria o teste mudar de resposta sozinho.
 */
let SEQ = 0;
function guardar(tabela, linhas) {
  const arr = Array.isArray(linhas) ? linhas : [linhas];
  const novas = arr.map((l) => ({ ...l, id: l?.id ?? `mock-${tabela}-${++SEQ}` }));
  if (Array.isArray(TABELAS[tabela])) TABELAS[tabela].push(...novas);
  // As views são a mesma coisa lida por outro nome: quem escreve em
  // `arena_efeitos` lê de volta em `efeito_visao`, e sem isto a leitura mentiria.
  const vista = { arena_efeitos: 'efeito_visao', combatentes: 'combate_visao', arena_tokens: 'token_visao' }[tabela];
  if (vista && Array.isArray(TABELAS[vista]) && TABELAS[vista] !== TABELAS[tabela]) TABELAS[vista].push(...novas);
  return novas;
}

/**
 * AS DUAS FUNÇÕES COM QUE O JOGADOR ESCREVE (migrações 22 e 28).
 *
 * O mock não tem RLS nem `security definer`, e não é para ter. Mas estas duas
 * decidem o que a TELA consegue fazer, e sem elas o caminho do jogador passava
 * por um `rpc` que devolvia lista vazia e sem erro: o ataque dele "funcionava"
 * na bancada com o relógio parado, e um teste ali passaria sem provar nada.
 *
 * A regra que importa é a da posse, e é a que está imitada: a `jogador_declara`
 * mexe no relógio da PRÓPRIA peça e em mais nenhuma; sobre o alvo ela só soma
 * Guarda sob pressão, sem tocar na agenda dele.
 */
function rpcJogador(nome, args) {
  const a = args || {};
  const acha = (id) => TABELAS.combatentes.find((c) => c.id === id);
  const refazerVisao = () => {
    if (PAPEL === 'jogador') TABELAS.combate_visao = TABELAS.combatentes.map(paraJogador);
  };
  if (nome === 'jogador_declara') {
    const c = acha(a.p_comb);
    if (!c) return { __erro: 'Esta peca nao e de uma mesa sua.' };
    if (c.personagem_id !== MEU_PC) {
      return { __erro: 'So o mestre empurra o relogio de uma peca que nao e sua.' };
    }
    c.tick = Math.max(0, a.p_tick ?? c.tick);
    c.acao = a.p_acao || {};
    const alvo = a.p_alvo ? acha(a.p_alvo) : null;
    if (alvo && (a.p_golpes || 0) > 0) {
      const antes = alvo.acao && Object.keys(alvo.acao).length
        ? alvo.acao : { golpes: [], livre: alvo.tick ?? 0 };
      alvo.acao = { ...antes, pressao: (antes.pressao || 0) + a.p_golpes };
    }
    refazerVisao();
    return [];
  }
  if (nome === 'jogador_muda_peca') {
    // Quatro colunas, e o que não for isso ela ignora calada: é o que a
    // migração 22 faz, e é por isso que o relógio precisou da 28.
    const c = acha(a.p_comb);
    if (c) {
      for (const k of ['pv_atual', 'mana_atual', 'condicoes', 'ativo']) {
        if (a.p_dados && k in a.p_dados) c[k] = a.p_dados[k];
      }
      refazerVisao();
    }
    return [];
  }
  return [];
}

/**
 * O `update` e o `delete` MEXEM na tabela, e para isso o `eq` precisa ser lembrado.
 *
 * Enquanto os dois devolviam lista vazia sem tocar em nada, todo caminho de
 * escrita passava no teste sem escrever: a tela mandava, a bancada respondia
 * "pronto" e a leitura seguinte trazia o estado velho. Um `filtros` vazio não
 * apaga a tabela inteira de propósito, ainda que o Postgres fizesse isso: um
 * engano meu aqui derrubaria a cena toda e o erro apareceria longe daqui.
 */
const casa = (linha, filtros) => filtros.every(([c, v]) => linha[c] === v);

function mudar(tabela, campos, filtros) {
  const arr = TABELAS[tabela];
  if (!Array.isArray(arr) || !filtros.length) return [];
  const tocadas = arr.filter((l) => casa(l, filtros));
  for (const l of tocadas) Object.assign(l, campos);
  return tocadas;
}

function remover(tabela, filtros) {
  const arr = TABELAS[tabela];
  if (!Array.isArray(arr) || !filtros.length) return [];
  const fora = arr.filter((l) => casa(l, filtros));
  TABELAS[tabela] = arr.filter((l) => !casa(l, filtros));
  return fora;
}

function encadeavel(tabela, verbo, valor) {
  const filtros = [];
  const o = {
    select: () => o, in: () => o, order: () => o, limit: () => o,
    eq: (col, val) => { filtros.push([col, val]); return o; },
    neq: () => o, is: () => o, not: () => o, or: () => o, gte: () => o, lte: () => o,
    maybeSingle: () => { o.__um = true; return o; },
    single: () => { o.__um = true; return o; },
    then: (ok, ko) => {
      anotar(verbo, tabela);
      const dado = typeof valor === 'function' ? valor(filtros) : valor;
      // A recusa também é resposta. Nada aqui erra por acidente (consulta que
      // ninguém ensinou devolve lista vazia, de propósito), mas quem imita uma
      // função do banco precisa poder dizer "não": sem isto, a bancada só
      // saberia contar o caminho feliz.
      if (dado && dado.__erro) {
        return Promise.resolve({ data: null, error: { message: dado.__erro } }).then(ok, ko);
      }
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
      insert: (l) => encadeavel(tab, 'insert', () => guardar(tab, l)),
      upsert: (l) => encadeavel(tab, 'upsert', () => guardar(tab, l)),
      update: (l) => encadeavel(tab, 'update', (f) => mudar(tab, l, f)),
      delete: () => encadeavel(tab, 'delete', (f) => remover(tab, f)),
    }),
    rpc: (nome, args) => encadeavel('rpc:' + nome, 'rpc', () => rpcJogador(nome, args)),
    channel: () => canal,
    removeChannel: () => Promise.resolve('ok'),
    storage: {
      from: () => ({
        createSignedUrl: async (c) => ({ data: BALDE.has(c) ? { signedUrl: BALDE.get(c) } : null, error: null }),
        createSignedUrls: async (cs) => ({
          data: (cs || []).filter((c) => BALDE.has(c)).map((c) => ({ path: c, signedUrl: BALDE.get(c) })),
          error: null,
        }),
        // O que sobe fica guardado como URL de objeto, e não como promessa
        // devolvida e esquecida: quem acabou de gravar uma arte girada volta
        // para a lista e precisa VER a arte girada, com a medida nova.
        upload: async (c, corpo) => {
          BALDE.set(c, corpo instanceof Blob ? URL.createObjectURL(corpo) : String(corpo));
          anotar('upload', c);
          return { data: { path: c }, error: null };
        },
        remove: async (cs) => {
          for (const c of cs || []) BALDE.delete(c);
          anotar('remove', (cs || []).join(','));
          return { data: [], error: null };
        },
        getPublicUrl: (c) => ({ data: { publicUrl: BALDE.get(c) || '' } }),
        list: async () => ({ data: [], error: null }),
      }),
    },
  };
  if (typeof window !== 'undefined') window.__SB = REG;
  return sb;
}

export default { createClient };
