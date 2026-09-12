// test-l86a-cura.mjs · a cura das Artes no tabuleiro, contra a régua e contra a mesa.
//
// Pendencias.md L86a (rodada 55): das sete Artes de cura, quatro eram "soma
// simples" na conta (`mao-firme` 1 PV/turno, `acelerar-a-cura` 1 PV/nível,
// `cura-guardada` 1 PV/ponto, `maos-sobre-a-multidao` 1 PV/nível em área,
// DECIDIDO PELO HUMANO em 12/09 mas ainda não escrito em `efeitos.json`, que
// continua com o parâmetro Cura em `tipo: "padrao"`), mas NENHUMA tinha
// encaixe de disparo: o laço de `verificarEfeitos` que propõe a mordida
// (`artes-grid-mesa.ts`) barrava todo Efeito sem `dano_dados` nem `condicao`,
// e o `gatilho: "armadilha"` era excluído de propósito. Desta rodada só
// `mao-firme` fecha de ponta a ponta: `acelerar-a-cura` e `cura-guardada`
// esbarram em ambiguidade de dado (nível da Arte vs. nível do Efeito, "ponto"
// sem definição), e `maos-sobre-a-multidao` não tem caminho de resolução
// nenhum (`forma: "zona"` não passa por lugar que cure ou fira); as três
// ficam de fora até cada uma virar decisão ou código novo.
//
// DOIS EIXOS, e este arquivo prova os dois:
//
//   1. A RÉGUA (`curaDoEfeito`, `artes-grid.ts`) só lê `Parametro.pontos`, um
//      campo ESTRUTURADO ao lado do rótulo em prosa. Nunca interpreta a
//      frase: duas especificações da mesma coisa (a frase e o padrão) se
//      separariam em silêncio, o mesmo formato do `casaExata` (L93). Hoje só
//      `mao-firme` tem o campo; os outros três devolvem `null` e por isso
//      não entram na guarda do laço, sem precisar de um `if` à parte.
//
//   2. O DESPACHO (`verificarEfeitos`, `artes-grid-mesa.ts`): a guarda da
//      linha que só deixava `dano_dados`/`condicao` passar agora também deixa
//      `cura`, e o ramo de resolução ganha `curarAlvo`, que chama
//      `ctx.gravarVida` (não escreve cru como `morder`/`aplicarDano`: L87 é
//      dívida registrada, não desta rodada).
//
// O QUE ESTE ARQUIVO NÃO TESTA, e por quê. `curarPv`/`gravarVida` de verdade
// moram em `grid.astro`, que este harness não importa (nenhum teste deste
// repositório importa `grid.astro` direto: `mesa-mock.mjs` reimplementa o que
// precisa, pelo mesmo motivo). O `gravarVida` daqui é um DUBLE que espelha a
// fórmula real (`Math.min(pv_max ?? antes+quanto, antes+quanto)`), no mesmo
// gesto do `gravarCondicao` de `test-arte-na-mesa.mjs`. A seção "uma
// implementação só", mais abaixo, fecha a lacuna: ela lê o TEXTO de
// `grid.astro` e prova que o teto mora só em `curarPv`, não copiado em
// `curar()`. E a volta à fila (`conferirFila`/`foraDaFila`, também só em
// `grid.astro`) não é reencenada aqui: foi confirmada por leitura direta do
// código no levantamento desta rodada (`foraDaFila` testa `pv_atual<=0` sem
// depender de condição), e a seção 4 prova o NÚMERO exato que essa leitura
// consome, nas duas direções.
//
//   node scripts/test-l86a-cura.mjs
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// ------------------------------------------------------------- o mundo de fora
// Mesma casca do test-arte-na-mesa.mjs: o módulo é da MESA (Supabase, SVG,
// `localStorage`), e nada disso existe em Node. A casca devolve vazio e deixa
// o código seguir pelos caminhos que não são de tela.
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const elementoFalso = () => ({
  innerHTML: '', hidden: false, style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  querySelectorAll: () => [], querySelector: () => null, appendChild() {}, append() {}, remove() {},
  setAttribute() {}, getAttribute: () => null, addEventListener() {}, getBoundingClientRect: () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }),
});
globalThis.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: elementoFalso,
  createElementNS: elementoFalso,
  body: elementoFalso(),
  addEventListener() {},
};
globalThis.window = globalThis;

// O DUBLE DO DIÁLOGO. `uiEscolher` de verdade (`ui-dialog.ts`) abre um
// `<dialog>` e espera um clique que nunca vem nesta casca. `verificarEfeitos`
// chama `uiEscolher` direto (não pelo `ctx`), então o duble troca o MÓDULO
// inteiro na hora de empacotar (`plugins`, abaixo), e cada cena que espera
// uma caixa prepara `globalThis.__uiEscolherResposta` antes de chamar. Uma
// cena que NÃO prepara e ainda assim recebe a chamada estoura, de propósito:
// isso vira a prova de que o improviso e o "já mordeu este turno" nem abrem
// a caixa (seção 5), em vez de só confiar que ninguém está olhando.
const chamadasEscolher = [];
globalThis.__uiEscolher = async (titulo, opcoes, opts) => {
  chamadasEscolher.push({ titulo, opcoes, opts });
  if (globalThis.__uiEscolherResposta == null) {
    throw new Error(`uiEscolher chamado sem resposta preparada (opções: ${opcoes.map((o) => o.valor).join(', ')})`);
  }
  const v = globalThis.__uiEscolherResposta;
  globalThis.__uiEscolherResposta = null;
  return v;
};

const duploUiDialog = {
  name: 'duble-ui-dialog',
  setup(b) {
    b.onResolve({ filter: /ui-dialog$/ }, () => ({ path: 'ui-dialog-duble', namespace: 'duble' }));
    b.onLoad({ filter: /.*/, namespace: 'duble' }, () => ({
      loader: 'js',
      contents: `
        export const uiErro = (msg) => { throw new Error('uiErro: ' + msg); };
        export const uiConfirmar = async () => true;
        export const uiEscolher = (...a) => globalThis.__uiEscolher(...a);
        export const uiPainel = async () => null;
        export const uiFormulario = async () => null;
      `,
    }));
  },
};

const saida = path.join(os.tmpdir(), `l86a-cura-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { gravarEfeito, verificarEfeitos, carregarEfeitos, efeitosAtivos } from './src/lib/artes-grid-mesa';
      export { curaDoEfeito, rodadaDoTick, TICKS_POR_TURNO, EFEITO } from './src/lib/artes-grid';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
  plugins: [duploUiDialog],
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };
const conferir = () => {
  if (!FALHAS.length) return;
  console.log(`\n✗ L86a · cura das Artes: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
};

// ------------------------------------------------------------ o banco de mentira
// Mesmo formato do `bancoFalso` de test-arte-na-mesa.mjs.
function bancoFalso() {
  const tabelas = { arena_efeitos: [], combatentes: [] };
  let seq = 0;
  const from = (tabela) => ({
    select: () => ({
      eq: (_col, val) => {
        const linhas = tabelas[tabela].slice();
        const p = Promise.resolve({ data: linhas, error: null });
        const uma = linhas.find((r) => r.id === val) || null;
        p.maybeSingle = async () => ({ data: uma, error: null });
        p.single = p.maybeSingle;
        return p;
      },
      limit: async () => ({ data: tabelas[tabela].slice(-1), error: null }),
    }),
    insert(linha) {
      const nova = { id: `ef${++seq}`, ...linha };
      tabelas[tabela].push(nova);
      return { select: () => ({ limit: async () => ({ data: [nova], error: null }) }) };
    },
    update(campos) {
      return {
        eq: async (_col, val) => {
          const alvo = tabelas[tabela].find((r) => r.id === val);
          if (alvo) Object.assign(alvo, campos);
          return { error: null };
        },
      };
    },
    delete: () => ({ eq: async (_c, val) => {
      tabelas[tabela] = tabelas[tabela].filter((r) => r.id !== val);
      return { error: null };
    } }),
  });
  return { SB: { from }, tabelas };
}

/**
 * A cena: um conjurador, um alvo, um tabuleiro, um relógio que a gente move,
 * e `gravarVida`: o DUBLE da fórmula real de `curarPv` (`grid.astro`), pelo
 * mesmo gesto do `gravarCondicao` em `test-arte-na-mesa.mjs`. Registra cada
 * chamada em `curas`, para as cenas que precisam contar quantas vezes o
 * caminho novo foi usado, e não só o resultado final.
 */
function cena({ tick = 0, pvAtual = 20, pvMax = 30 } = {}) {
  const banco = bancoFalso();
  const conjurador = { id: 'c1', nome: 'Curandeira', tipo: 'custom', tick, condicoes: [], oculto: false };
  const alvo = { id: 'a1', nome: 'Ogro', tipo: 'custom', tick, condicoes: [], pv_atual: pvAtual, pv_max: pvMax };
  banco.tabelas.combatentes.push(conjurador, alvo);
  const registro = [];
  const curas = [];
  const relogio = { t: tick };
  const ctx = {
    SB: banco.SB,
    arena: { id: 'ar1', cols: 20, rows: 20, escala_m: 1 },
    enc: { id: 'en1' },
    combs: [conjurador, alvo],
    tokens: { c1: { q: 0, r: 0 }, a1: { q: 3, r: 0 } },
    resumo: { a1: { soak: { impacto: 0, corte: 0, perfuracao: 0 }, resistPerf: 0 } },
    fichas: {}, raio: 30, mestre: true,
    hexNaTela: () => null,
    tickAgora: () => relogio.t,
    logar: async (_c, txt) => { registro.push(txt); },
    recarregar: async () => {},
    repintar: () => {},
    repintarEfeitos: () => {},
    gravarCondicao: async (cid, condicoes) => {
      const { error } = await banco.SB.from('combatentes').update({ condicoes }).eq('id', cid);
      return { error };
    },
    // O NÚCLEO DA CURA, duble. A fórmula é a mesma linha de `curarPv`
    // (`grid.astro`): `Math.min(pv_max ?? antes+quanto, antes+quanto)`. SEM
    // `Math.max(0, ...)` nenhum, de propósito: a real não tem piso, e um
    // duble com piso passaria a seção 4 pelo motivo errado (ver o comentário
    // lá).
    gravarVida: async (cid, quanto) => {
      const c = [conjurador, alvo].find((x) => x.id === cid);
      if (!c) return { pv: null, error: { message: 'não encontrado' } };
      const antes = c.pv_atual ?? 0;
      const pv = Math.min(c.pv_max ?? antes + quanto, antes + quanto);
      c.pv_atual = pv;
      curas.push({ cid, quanto, pv });
      return { pv, error: null };
    },
  };
  return { banco, ctx, conjurador, alvo, registro, curas, relogio };
}

/** O Efeito real `mao-firme`, para o `plano` que `gravarEfeito` espera. */
const EF_MAO_FIRME = M.EFEITO['mao-firme'];
ok(!!EF_MAO_FIRME, 'o catálogo real tem `mao-firme` (senão as cenas abaixo testariam o quê)');

const planoMaoFirme = (over = {}) => ({
  arte: { id: 'cura', nome: 'Cura', grid: { elemento: null } },
  efeito: EF_MAO_FIRME,
  nome: 'Mão Firme',
  resumo: 'Mão Firme nível 1',
  escolhas: { Duração: 2 },
  molde: null, angulo: 0, ladoBaseM: 0,
  danoDados: 0, danoBonus: 0, turnos: 6,
  velocidadeTicks: 6,
  custo: { total: 1, mana: 1 },
  alcanceM: 0, curvaturaGraus: 0, fatias: 1, abrirCobra: 'meio',
  ...over,
});

// ============================================================ 1 · a régua pura
console.log('· a régua (`curaDoEfeito`) só lê `pontos`, contra o catálogo real');
{
  ok(M.curaDoEfeito(M.EFEITO['mao-firme']) === 1, '`mao-firme` devolve 1 (o único com `pontos` estruturado)');
  ok(M.curaDoEfeito(M.EFEITO['acelerar-a-cura']) === null,
    '`acelerar-a-cura` devolve null: "por nível" não tem `pontos`, e a régua não adivinha');
  ok(M.curaDoEfeito(M.EFEITO['cura-guardada']) === null,
    '`cura-guardada` devolve null: "por ponto" não tem `pontos`, e "ponto" nem está definido');
  ok(M.curaDoEfeito(M.EFEITO['maos-sobre-a-multidao']) === null,
    '`maos-sobre-a-multidao` devolve null: o parâmetro Cura dele ainda é "padrao" no JSON, sem `pontos` '
    + '(1 PV/nível já foi decidido pelo humano em 12/09, mas ainda não foi escrito ali; Pendencias.md L86)');
  ok(M.curaDoEfeito(null) === null, 'sem Efeito (o improviso) devolve null, sem precisar de `if` à parte');
}
conferir();

// ================================================ 2 · por turno, não uma vez só
console.log('\n· mao-firme cura 1 PV por TURNO, atravessando três rodadas');
{
  const { ctx, alvo, relogio, curas } = cena({ tick: 0, pvAtual: 20, pvMax: 30 });
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], planoMaoFirme(), { forma: 'alvo', figura: null, alvos: ['a1'] });
  const ef = M.efeitosAtivos()[0];
  ok(ef.desde_tick === 5, `sai no Tick 5 (Velocidade 6 do Tick 0): ${ef.desde_tick}`);
  ok(M.rodadaDoTick(5) === 1 && M.rodadaDoTick(6) === 2 && M.rodadaDoTick(12) === 3,
    'confere a régua de rodada que o resto da cena usa (Tick 5→rodada 1, 6→2, 12→3)');

  // TICK 5 · o efeito sai E já cura no mesmo `verificarEfeitos` (o laço da
  // saída e o das mordidas pendentes rodam na mesma chamada): não há um
  // segundo disparo faltando para o Tick de saída, a cura já acontece nele.
  relogio.t = 5;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 21, `Tick 5 (rodada 1): cura 1 PV no mesmo Tick em que sai (${alvo.pv_atual})`);
  ok(curas.length === 1, 'e passou pelo `gravarVida` novo, não por escrita crua');

  // MESMO TICK DE NOVO (duas ações no mesmo Tick, por exemplo): não cura duas
  // vezes. Não prepara `__uiEscolherResposta`: se a caixa abrisse, o duble
  // estouraria, e É ISSO que prova que ninguém foi proposto.
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 21, 'o mesmo Tick chamado de novo não cura outra vez (ninguém ficou pendente)');

  // TICK 6 · rodada 2: cura de novo.
  relogio.t = 6;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 22, `Tick 6 (rodada 2): cura de novo (${alvo.pv_atual})`);

  // TICK 11 · ainda rodada 2: não cura (já curou nesta rodada, em Tick diferente).
  relogio.t = 11;
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 22, 'Tick 11, ainda rodada 2: sem cura nova (é a MESMA rodada do Tick 6)');

  // TICK 12 · rodada 3: cura de novo. É o par que prova "por turno" contra
  // "uma vez só": sem ele, um efeito que curasse uma única vez na vida
  // passaria as três asserções de cima pelo motivo errado.
  relogio.t = 12;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 23, `Tick 12 (rodada 3): terceira cura (${alvo.pv_atual})`);
  ok(curas.length === 3, 'três chamadas a `gravarVida` em três rodadas, nenhuma a mais');
}
conferir();

// ==================================================================== 3 · o teto
console.log('\n· o teto de pv_max, pela mesma via do despacho (não só a fórmula solta)');
{
  // Conjurado no Tick 0, igual à seção 2: sai no Tick 5. Testar já no Tick
  // 5 (e não no de conjurar) é o que faz `montando(ef, t)` ser falso e o
  // efeito de fato chegar à proposta de cura.
  const { ctx, alvo, relogio, curas } = cena({ tick: 0, pvAtual: 30, pvMax: 30 }); // já no máximo
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], planoMaoFirme(), { forma: 'alvo', figura: null, alvos: ['a1'] });
  relogio.t = 5;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 30, `curar quem já está no teto não passa dele (${alvo.pv_atual}/30)`);
  ok(curas.length === 1 && curas[0].pv === 30, 'e o `gravarVida` foi chamado mesmo assim: o teto mora na escrita, não na proposta');
}
conferir();

// ============================================== 4 · o chão, nas duas direções
console.log('\n· o chão (pv_atual<=0), nas duas direções, pela fórmula exata');
{
  // Direto num duble isolado, não pelo despacho: o que está sob prova aqui é
  // o NÚMERO que `curarPv`/`gravarVida` produz, não o laço que decide chamar
  // (a seção 2 já provou o laço). A asserção confere o NÚMERO EXATO (-4), não
  // só o sinal: um duble com `Math.max(0, ...)` (o reflexo de `morder`)
  // devolveria 0 aqui, que também é <= 0, e a asserção passaria pelo motivo
  // errado. A real não tem piso, e -4 é a única resposta que prova isso.
  const banco = bancoFalso();
  const alvo = { id: 'a1', nome: 'Ogro', pv_atual: -5, pv_max: 30 };
  banco.tabelas.combatentes.push(alvo);
  const gravarVida = async (cid, quanto) => {
    const c = [alvo].find((x) => x.id === cid);
    const antes = c.pv_atual ?? 0;
    const pv = Math.min(c.pv_max ?? antes + quanto, antes + quanto);
    c.pv_atual = pv;
    return { pv, error: null };
  };
  const { pv: pvFica } = await gravarVida('a1', 1);
  ok(pvFica === -4, `-5 curando 1 PV vira -4, não 0 (sem piso na fórmula real): ${pvFica}`);
  ok(pvFica <= 0, 'e -4 continua <= 0: por leitura direta de `foraDaFila` (grid.astro), fica fora da fila');

  alvo.pv_atual = -1;
  const { pv: pvVolta } = await gravarVida('a1', 5);
  ok(pvVolta === 4, `-1 curando 5 PV vira 4: ${pvVolta}`);
  ok(pvVolta > 0, 'e 4 > 0: por leitura direta de `foraDaFila`, volta a contar para a fila');
}
conferir();

// =========================================================== 5 · o improviso
console.log('\n· o improviso (sem Efeito comprado) não cura');
{
  // Cast no Tick 0, testado no Tick 5 (sai): mesmo cuidado da seção 3, para
  // `montando(ef, t)` estar falso na hora de conferir.
  const { ctx, alvo, relogio, curas } = cena({ tick: 0, pvAtual: 20, pvMax: 30 });
  await M.carregarEfeitos(ctx);
  // `plano.efeito: null` é o formato real do improviso (`conjurar`,
  // `artes-grid-mesa.ts`: `efeito_id: plano.efeito?.id || null`).
  await M.gravarEfeito(ctx, ctx.combs[0], planoMaoFirme({ efeito: null, nome: 'Cura improvisada' }),
    { forma: 'alvo', figura: null, alvos: ['a1'] });
  relogio.t = 5;
  // Sem `__uiEscolherResposta`: se a caixa abrisse, o duble estouraria.
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 20, 'sem Efeito comprado, `curaDoEfeito` não tem o que ler, e ninguém cura');
  ok(curas.length === 0, 'e `gravarVida` nunca foi chamado: a caixa nem abriu');
}
conferir();

// ================================ 6 · rótulo e resolução não podem discordar
//
// O ACHADO DO ARQUITETO (13/09/2026, conferência no disco): a resolução
// (`dano_dados`, depois `condicao`, depois `cura`) e o rótulo do grupo da
// caixa tinham ORDENS DIFERENTES de precedência. `mao-firme` nunca expõe o
// defeito (não tem `dano_dados`), mas o `dreno` (L86b: "1 PV a cada 2 de dano
// que passar") tem os dois ao mesmo tempo, e resolveria como dano rotulado
// como cura. Esta cena fabrica um Efeito com essa forma (sem esperar o
// `dreno` de verdade) e prova as duas metades: o RÓTULO oferecido diz
// "Confirmar a mordida", e a RESOLUÇÃO de fato tira Vida, não cura.
console.log('\n· um Efeito com dano E cura ao mesmo tempo: rótulo e resolução concordam (a forma do `dreno`, L86b)');
{
  const EF_DANO_E_CURA = {
    id: 'dreno-sintetico', nome: 'Dreno (sintético)', nivel: 3,
    artes: [{ id: 'morte' }],
    parametros: [
      { nome: 'Alcance', tipo: 'fixo', valor: 'toque' },
      { nome: 'Cura', tipo: 'fixo', valor: '1 PV a cada 2 de dano que passar', pontos: 1 },
    ],
    grid: {
      forma: 'alvo', ancora: 'alvo', gatilho: 'por-turno', alvo: 'um', persiste: true,
      materia: null, condicao: null, condicaoAparente: null, pegaItem: false,
      arenaInteira: false, dissipa: false, fere: true, cura: true, teste: false,
    },
  };
  ok(M.curaDoEfeito(EF_DANO_E_CURA) === 1, 'a régua lê `pontos` normalmente neste Efeito sintético (pré-condição da cena)');

  // `verificarEfeitos` não confia no `plano.efeito` guardado: relê a cura por
  // `EFEITO[ef.efeito_id]`, o CATÁLOGO real (mesmo texto do laço, `artes-grid-
  // mesa.ts`). Sem registrar o sintético ali, `ef.efeito_id` bateria num id que
  // o catálogo não conhece, `curaDoEfeito` devolveria `null` por CATÁLOGO
  // FALTANDO (não pela ordem da guarda), e esta cena provaria a coisa errada.
  M.EFEITO['dreno-sintetico'] = EF_DANO_E_CURA;

  const { ctx, alvo, relogio } = cena({ tick: 0, pvAtual: 20, pvMax: 30 });
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], planoMaoFirme({ efeito: EF_DANO_E_CURA, danoDados: 2, nome: 'Dreno sintético' }),
    { forma: 'alvo', figura: null, alvos: ['a1'] });
  relogio.t = 5;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);

  const chamada = chamadasEscolher[chamadasEscolher.length - 1];
  const opcao = chamada.opcoes.find((o) => o.valor === '0');
  ok(!!opcao && opcao.grupo === 'Confirmar a mordida',
    `o rótulo oferecido é "Confirmar a mordida" (achou: ${opcao && opcao.grupo})`);
  ok(alvo.pv_atual < 20, `e a resolução de fato tirou Vida, não curou (${alvo.pv_atual}/30, começou em 20)`);
}
conferir();

// ============================================= 7 · uma implementação só (grid.astro)
console.log('\n· uma implementação só: o teto mora em `curarPv`, não copiado em `curar()`');
{
  const txt = fs.readFileSync(path.join(ROOT, 'src/pages/mesa/grid.astro'), 'utf8');
  ok(txt.includes('const curarPv = async'), '`curarPv` existe em grid.astro');
  ok(/const curarPv[\s\S]{0,400}?Math\.min\(c\.pv_max/.test(txt),
    '`curarPv` tem o clamp de `pv_max` (a régua do teto)');
  ok(txt.includes('gravarVida: curarPv'), '`ctxArtes()` empresta `curarPv` como `gravarVida`, sem copiar a fórmula');

  const m = /async function curar\(cid: string\) \{[\s\S]*?\n  \}/.exec(txt);
  ok(!!m, 'achou o corpo de `curar()` (o menu do mestre) para conferir');
  if (m) {
    ok(!/Math\.min/.test(m[0]), '`curar()` não tem `Math.min` próprio: chama `curarPv`, não reimplementa o teto');
    ok(m[0].includes('curarPv(cid'), '`curar()` de fato chama `curarPv`');
  }
}
conferir();

console.log('');
if (FALHAS.length) {
  console.log(`✗ L86a · cura das Artes: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
}
console.log(`✓ L86a · cura das Artes OK · ${PASSOU} asserções: a régua só lê o campo estruturado,`
  + ' o despacho cura por turno (não uma vez só), o teto mora num lugar, o chão não tem piso escondido,'
  + ' e o improviso fica de fora sem precisar de guarda extra');
