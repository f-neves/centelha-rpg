// test-l86b-acelerar-cura.mjs · acelerar-a-cura no tabuleiro, 1 PV por nível da Arte.
//
// Pendencias.md L86b (rodada 56): `acelerar-a-cura` cura `nivel_arte` PV por
// turno, onde `nivel_arte` é o nível investido na ARTE por quem conjurou
// (`plano.nivelArte`), não o nível do Efeito nem o grau do parâmetro Cura
// (esse parâmetro é `fixo`, não tem grau: `parametrosAjustaveis` filtra
// `tipo !== 'fixo'`). As duas perguntas que travavam este item (o que "nível"
// indexa; se a área divide) foram respondidas pelo humano em 12/09: é o nível
// da Arte, e a área (`maos-sobre-a-multidao`) não entra nesta rodada.
//
// A MIGRAÇÃO 38 (`supabase/migracao-38.sql`) está escrita e carimbada, NÃO
// rodada: cria `arena_efeitos.nivel_arte`, nula, sem default. Este arquivo
// prova as DUAS PONTAS do contrato que ela fixa:
//
//   GRAVAR (`gravarEfeito`, `artes-grid-mesa.ts`): escreve `nivel_arte` na
//   linha; se o banco recusar por coluna ausente (`PGRST204`), regrava sem
//   ela, e a cena segue (mesmo princípio do `carimbarSeFaltar`, migração 29).
//   Gravação de efeito não pode falhar inteira por um campo que é melhoria.
//
//   LER (o laço por-turno de `verificarEfeitos`, aberto na rodada 55 para a
//   cura): `nivel_arte` nulo é "não sei", NUNCA 1. Um Efeito que pede cura
//   por nível e não tem o dado não cura, e a cena avisa no registro, no
//   máximo uma vez por turno: O FATO ("esta linha não guarda o nível da
//   Arte") mais a CONFERÊNCIA ("confira se a migração 38 rodou"), nunca o
//   DIAGNÓSTICO ("falta rodar"): nulo tem mais de uma causa (linha velha,
//   cliente velho, migração não rodada), e afirmar uma aponta a errada para
//   quem já rodou.
//
// Node puro (sem navegador), mesmo harness de `test-l86a-cura.mjs`: o módulo
// é da MESA, e o `gravarVida`/`curarPv` de verdade mora em `grid.astro`
// (nenhum teste deste repositório importa esse arquivo direto). O duble aqui
// espelha a fórmula real, como lá.
//
//   node scripts/test-l86b-acelerar-cura.mjs
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// ------------------------------------------------------------- o mundo de fora
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

// O DUBLE DO DIÁLOGO, mesmo gesto de `test-l86a-cura.mjs`.
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

const saida = path.join(os.tmpdir(), `l86b-acelerar-cura-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { gravarEfeito, verificarEfeitos, carregarEfeitos, efeitosAtivos } from './src/lib/artes-grid-mesa';
      export { curaDoEfeito, curaPrecisaNivelArte, rodadaDoTick, TICKS_POR_TURNO, EFEITO } from './src/lib/artes-grid';
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
  console.log(`\n✗ L86b · acelerar-a-cura: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
};

// ------------------------------------------------------------ o banco de mentira
// Mesmo formato do `bancoFalso` de test-l86a-cura.mjs, com UM parâmetro novo:
// `semColunaNivelArte` faz o `insert` recusar qualquer linha que traga
// `nivel_arte`, exatamente como o PostgREST recusaria contra um banco sem a
// migração 38 (`PGRST204`, mensagem citando a coluna e "schema cache"). É
// como se simula, sem banco de verdade, o lado que a migração ainda não
// rodou.
function bancoFalso({ semColunaNivelArte = false } = {}) {
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
      if (tabela === 'arena_efeitos' && semColunaNivelArte && 'nivel_arte' in linha) {
        return {
          select: () => ({
            limit: async () => ({
              data: null,
              error: {
                code: 'PGRST204',
                message: "Could not find the 'nivel_arte' column of 'arena_efeitos' in the schema cache",
              },
            }),
          }),
        };
      }
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

/** A cena: conjurador, alvo, relógio, `gravarVida` (duble da fórmula real de `curarPv`). */
function cena({ tick = 0, pvAtual = 20, pvMax = 30, semColunaNivelArte = false } = {}) {
  const banco = bancoFalso({ semColunaNivelArte });
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

/** O Efeito real `acelerar-a-cura`. */
const EF_ACELERAR = M.EFEITO['acelerar-a-cura'];
ok(!!EF_ACELERAR, 'o catálogo real tem `acelerar-a-cura` (senão as cenas abaixo testariam o quê)');

const planoAcelerar = (over = {}) => ({
  arte: { id: 'vida', nome: 'Vida', grid: { elemento: null } },
  efeito: EF_ACELERAR,
  nome: 'Acelerar a Cura',
  resumo: 'Acelerar a Cura nível 3',
  escolhas: { Duração: 2 },
  molde: null, angulo: 0, ladoBaseM: 0,
  danoDados: 0, danoBonus: 0, turnos: 6,
  velocidadeTicks: 6,
  custo: { total: 1, mana: 1 },
  alcanceM: 0, curvaturaGraus: 0, fatias: 1, abrirCobra: 'meio',
  nivelArte: 3,
  ...over,
});

// ============================================================ 1 · a régua pura
console.log('· a régua (`curaDoEfeito`/`curaPrecisaNivelArte`) contra o catálogo real');
{
  ok(M.curaDoEfeito(EF_ACELERAR, 3) === 3, '`acelerar-a-cura` com nivelArte 3 devolve 3');
  ok(M.curaDoEfeito(EF_ACELERAR, 1) === 1, 'e com nivelArte 1 devolve 1 (1 PV por nível, sem multiplicador)');
  ok(M.curaDoEfeito(EF_ACELERAR, null) === null, 'sem nivelArte devolve null: não inventa 1 nem 0');
  ok(M.curaPrecisaNivelArte(EF_ACELERAR) === true, '`acelerar-a-cura` PEDE nivel_arte (`porNivel`)');
  ok(M.curaPrecisaNivelArte(M.EFEITO['mao-firme']) === false,
    '`mao-firme` não pede: tem `pontos` fixo, a régua nem olha pra `porNivel`');
  ok(M.curaDoEfeito(M.EFEITO['mao-firme'], null) === 1,
    'e `mao-firme` continua curando 1 sem depender de nivelArte nenhum (regressão da rodada 55)');
  // DOCUMENTADO em `Parametro.porNivel` (artes-grid.ts): `pontos` vence em
  // silêncio se os dois existirem no mesmo parâmetro. Nenhum Efeito real tem
  // os dois hoje; este sintético prova o que o comentário promete, sem
  // esperar por uma Arte real que colida.
  const EF_OS_DOIS = {
    id: 'sintetico-pontos-e-porNivel',
    parametros: [{ nome: 'Cura', tipo: 'fixo', valor: '5 PV', pontos: 5, porNivel: true }],
  };
  ok(M.curaDoEfeito(EF_OS_DOIS, 3) === 5,
    `com os dois no mesmo parâmetro, \`pontos\` vence e \`porNivel\` é ignorado (achou: ${M.curaDoEfeito(EF_OS_DOIS, 3)})`);
}
conferir();

// ================================================ 2 · nivel_arte presente cura certo
console.log('\n· `nivel_arte` 3 cura 3 PV por turno, atravessando duas rodadas');
{
  const { ctx, alvo, relogio, curas } = cena({ tick: 0, pvAtual: 10, pvMax: 30 });
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], planoAcelerar({ nivelArte: 3 }),
    { forma: 'alvo', figura: null, alvos: ['a1'] });
  const ef = M.efeitosAtivos()[0];
  ok(ef.nivel_arte === 3, `a linha gravada tem nivel_arte 3 (achou: ${ef.nivel_arte})`);
  ok(ef.desde_tick === 5, `sai no Tick 5 (Velocidade 6 do Tick 0): ${ef.desde_tick}`);

  relogio.t = 5;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 13, `Tick 5 (rodada 1): cura 3 PV, não 1 (${alvo.pv_atual})`);
  ok(curas.length === 1 && curas[0].quanto === 3, 'e o `gravarVida` recebeu 3, o nível da Arte, não o grau do parâmetro');

  relogio.t = 6;
  globalThis.__uiEscolherResposta = '0';
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 16, `Tick 6 (rodada 2): cura de novo, +3 (${alvo.pv_atual})`);
}
conferir();

// ======================================== 3 · nivel_arte nulo não cura, e avisa
console.log('\n· `nivel_arte` nulo (migração 38 não rodou): não cura, avisa uma vez por turno');
{
  // `semColunaNivelArte: true` simula o banco ANTES da migração 38: o
  // `insert` de `gravarEfeito` recusa a coluna, ele regrava sem ela, e a
  // linha que entra em `ATIVOS` fica com `nivel_arte: null` (não o número
  // que o cliente sabia: a COLUNA não soube guardar, e quem lê a linha
  // depois não tem como recuperar o que não foi escrito).
  const { ctx, alvo, relogio, curas, registro } = cena({ tick: 0, pvAtual: 10, pvMax: 30, semColunaNivelArte: true });
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], planoAcelerar({ nivelArte: 3 }),
    { forma: 'alvo', figura: null, alvos: ['a1'] });
  const ef = M.efeitosAtivos()[0];
  ok(ef != null, 'a gravação não falhou inteira por a coluna não existir');
  ok(ef.nome === 'Acelerar a Cura', 'e a linha é a Arte certa, não um `undefined`');

  relogio.t = 5;
  // Sem `__uiEscolherResposta`: se a caixa de cura abrisse, o duble estouraria.
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 10, 'sem `nivel_arte` na linha, ninguém cura (nulo não é 1)');
  ok(curas.length === 0, 'e `gravarVida` nunca foi chamado: a caixa nem abriu');
  // O FATO mais a CONFERÊNCIA, nunca o DIAGNÓSTICO: nulo tem mais de uma
  // causa (linha velha, cliente velho, migração não rodada), e "falta
  // rodar" afirmaria uma só, errada para quem já rodou. "Confira se" oferece
  // o próximo passo sem afirmar a causa.
  ok(registro.some((l) => /não guarda o nível da Arte/.test(l)),
    `e o registro cita o FATO (achou: ${JSON.stringify(registro)})`);
  ok(registro.some((l) => /confira se a migração 38 rodou/.test(l)) && !registro.some((l) => /falta rodar/i.test(l)),
    'e oferece a CONFERÊNCIA ("confira se"), nunca o diagnóstico ("falta rodar")');

  // MESMO TICK DE NOVO: não duplica o aviso (a régua de "uma vez por turno"
  // do `jaMordido`/`marcarMordido` vale para o aviso também, não só pra
  // mordida/cura de verdade).
  const antesDoRegistro = registro.length;
  await M.verificarEfeitos(ctx);
  ok(registro.length === antesDoRegistro, 'o mesmo Tick chamado de novo não duplica o aviso');

  // TICK 6, rodada 2: avisa de novo (é "uma vez por turno", não "uma vez na vida").
  relogio.t = 6;
  await M.verificarEfeitos(ctx);
  ok(registro.length === antesDoRegistro + 1, 'Tick 6 (rodada 2): avisa de novo, uma vez');
  ok(alvo.pv_atual === 10, 'e continua sem curar nenhuma rodada');
}
conferir();

console.log('');
if (FALHAS.length) {
  console.log(`✗ L86b · acelerar-a-cura: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
}
console.log(`✓ L86b · acelerar-a-cura OK · ${PASSOU} asserções: a régua escala com nivel_arte,`
  + ' o despacho cura 3 PV/turno quando o dado existe, degrada sem quebrar quando a migração 38 não rodou,'
  + ' e avisa no registro sem inventar um número');
