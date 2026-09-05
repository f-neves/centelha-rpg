// test-arte-na-mesa.mjs · a Arte que sai no Tick certo, provada no caminho da MESA.
//
// POR QUE ESTE ARQUIVO EXISTE, e o motivo é mais importante que o que ele testa.
//
// Em 04/09 o conserto da §5.3 do Arcano (a Arte resolve no ÚLTIMO Tick da
// montagem) foi escrito, revisado, commitado e publicado **desligado**. A marca
// de "ainda vai sair" ia para o banco e era jogada fora na memória por uma linha
// anterior que o conserto não tocou:
//
//     ATIVOS.push({ ...(data || [])[0], mordidos: {} })
//
// `deveSair()` era falso nos três pontos que a consultam, e cada um voltava a
// resolver na declaração. Com um F5 no meio a marca voltava do banco e o bloco
// resolvia DE NOVO: uma mordida a menos ou uma a mais, dependendo de recarregar.
//
// **E nada acusou.** O `test-artes-grid.mjs` empacota só `artes-grid.ts`;
// reverter `artes-grid-mesa.ts` inteiro deixava o `npm run validate` verde. O
// espelho de motor não tem Arte nenhuma. O conserto não tinha nada que falhasse
// se fosse removido, que é a terceira pergunta do critério.
//
// A REVISORA VIU PORQUE RODOU A CENA. Eu li o diff. O diff estava certo: as três
// guardas novas estão corretas, a marca é gravada, a varredura a paga. O que o
// diff não mostra é a linha que NÃO está nele, setenta linhas abaixo, desfazendo
// tudo. É o que este arquivo passa a guardar.
//
// O QUE ELE PROVA, e é a cena dela:
//
//   Prisão de Terra, Velocidade 6, conjurada no Tick 3. Sai no 8.
//     · no Tick 3, o alvo NÃO está Imobilizado (era o defeito visível);
//     · nos Ticks 4 a 7 continua sem condição nenhuma;
//     · no Tick 8 a condição entra, uma vez;
//     · no Tick 9 nada acontece de novo (era o outro defeito, o do F5).
//
//   E a metade do dano, no mesmo desenho: o Dardo não fere na declaração, fere
//   no Tick da saída, e não fere duas vezes.
//
// O PONTO DE ENTRADA é `gravarEfeito`, que é o mais alto que cabe em Node: o
// `conjurar` acima dele abre o assistente e precisa de navegador. Daqui para
// baixo é dado e relógio, e é onde o defeito morava.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// ------------------------------------------------------------- o mundo de fora
// O módulo é da MESA: ele importa o cliente do Supabase (que lê `import.meta.env`
// no topo), guarda ajustes em `localStorage` e desenha em SVG. Nada disso existe
// em Node, e é justamente por isso que ele estava fora de teste. As três coisas
// custam dez linhas de casca, e a casca é honesta: ela não finge fazer nada,
// devolve vazio e deixa o código seguir pelos caminhos que não são de tela.
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

const saida = path.join(os.tmpdir(), `arte-mesa-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { gravarEfeito, verificarEfeitos, carregarEfeitos, efeitosAtivos } from './src/lib/artes-grid-mesa';
      export { A_SAIR, deveSair, montando, TICKS_POR_TURNO } from './src/lib/artes-grid';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

/**
 * PARA NA PRIMEIRA CENA QUE FALHA, e não é impaciência.
 *
 * Com o defeito de volta, a cena 1 acusa por asserção (a condição entra na
 * declaração, e a marca não está na memória) e a cena 2 **quebra**: sem a marca,
 * o Dardo chega na varredura de mordidas e ela abre uma caixa de escolha, que
 * numa casca de DOM sem eventos estoura em vez de responder.
 *
 * Um teste que morre com `TypeError` num arquivo temporário diz que algo deu
 * errado e não diz o quê. Parar aqui faz o motivo ser a última linha da saída,
 * que é a única que alguém lê quando o portão fica vermelho.
 */
const conferir = () => {
  if (!FALHAS.length) return;
  console.log(`\n✗ Arte na mesa: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  console.log('\n  As cenas seguintes não rodaram: com este defeito elas quebram na casca'
    + ' de DOM em vez de acusar, e o erro delas esconderia o de cima.');
  process.exit(1);
};

// ------------------------------------------------------------ o banco de mentira
/**
 * O mínimo que este caminho usa do Supabase, e nada além.
 *
 * Ele GUARDA as linhas, e não só as registra: o defeito que se está guardando é
 * exatamente uma divergência entre o que foi para o banco e o que ficou na
 * memória, então um duble que esqueça o que recebeu não serviria para nada.
 */
function bancoFalso() {
  const tabelas = { arena_efeitos: [], combatentes: [] };
  const chamadas = [];
  let seq = 0;
  const from = (tabela) => ({
    select: () => ({
      // A `eq` do cliente de verdade e AGUARDAVEL e ENCADEAVEL ao mesmo tempo:
      // `await ...eq(...)` devolve as linhas, e `...eq(...).maybeSingle()` devolve
      // uma. O duble so tinha a primeira metade, e a segunda faltando fez o
      // `marcarMordido` explodir aqui sem ter defeito nenhum. Duble que nao imita
      // a forma da interface mede a forma do duble.
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
      chamadas.push({ op: 'insert', tabela, linha: nova });
      return { select: () => ({ limit: async () => ({ data: [nova], error: null }) }) };
    },
    update(campos) {
      return {
        eq: async (_col, val) => {
          const alvo = tabelas[tabela].find((r) => r.id === val);
          if (alvo) Object.assign(alvo, campos);
          chamadas.push({ op: 'update', tabela, id: val, campos });
          return { error: null };
        },
      };
    },
    delete: () => ({ eq: async (_c, val) => {
      tabelas[tabela] = tabelas[tabela].filter((r) => r.id !== val);
      chamadas.push({ op: 'delete', tabela, id: val });
      return { error: null };
    } }),
  });
  return { SB: { from }, tabelas, chamadas };
}

/** A cena: um conjurador, um alvo, um tabuleiro, e um relógio que a gente move. */
function cena({ tick = 3 } = {}) {
  const banco = bancoFalso();
  const conjurador = { id: 'c1', nome: 'Feiticeira', tipo: 'custom', tick, condicoes: [], oculto: false };
  const alvo = { id: 'a1', nome: 'Ogro', tipo: 'custom', tick, condicoes: [], pv_atual: 30, pv_max: 30 };
  banco.tabelas.combatentes.push(conjurador, alvo);
  const registro = [];
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
  };
  return { banco, ctx, conjurador, alvo, registro, relogio };
}

/** Um plano de conjuração montado à mão, do formato que o assistente devolve. */
const plano = (over = {}) => ({
  arte: { id: 'terra', nome: 'Terra', grid: { elemento: null } },
  efeito: { id: 'prisao', nome: 'Prisão', nivel: 3, grid: { forma: 'alvo', gatilho: 'passivo', condicao: 'imobilizado' } },
  nome: 'Prisão de Terra',
  resumo: 'Prisão de Terra nível 3',
  escolhas: { Duração: 3 },
  molde: 'explosao', angulo: 60, ladoBaseM: 0,
  danoDados: 0, danoBonus: 0, turnos: 3,
  velocidadeTicks: 6,
  custo: { total: 6, mana: 3 },
  alcanceM: 10, curvaturaGraus: 0, fatias: 1, abrirCobra: 'meio',
  ...over,
});

const temCondicao = (c, id) => (c.condicoes || []).some((k) => k.id === id);

// =========================================================== 1 · a cena da revisora
console.log('· Prisão de Terra, Velocidade 6, conjurada no Tick 3 · sai no 8');
{
  const { ctx, alvo, relogio, banco, registro } = cena({ tick: 3 });
  await M.gravarEfeito(ctx, ctx.combs[0], plano(), { forma: 'alvo', figura: null, alvos: ['a1'] });

  const ef = M.efeitosAtivos()[0];
  ok(!!ef, 'o efeito entrou na cena');
  ok(ef.desde_tick === 8, `e ele sai no Tick 8, e não no 3 (desde_tick = ${ef.desde_tick})`);

  // A ASSERÇÃO QUE TERIA PEGO O DEFEITO. A marca vai para o banco E fica na
  // memória: era a segunda metade que a linha do `push` desfazia.
  ok(!!banco.tabelas.arena_efeitos[0].mordidos[M.A_SAIR],
    'a linha GRAVADA nasce devendo a saída');
  ok(M.deveSair(ef),
    'e o efeito EM MEMÓRIA também · é aqui que o conserto estava desligado');

  ok(!temCondicao(alvo, 'imobilizado'),
    'no Tick 3, o alvo NÃO está Imobilizado: o gesto está à vista e é só isso');

  // Os Ticks de montagem: nada acontece em nenhum deles.
  for (const t of [4, 5, 6, 7]) {
    relogio.t = t;
    await M.verificarEfeitos(ctx);
  }
  ok(!temCondicao(alvo, 'imobilizado'), 'e continua livre nos Ticks 4, 5, 6 e 7');
  ok(M.deveSair(M.efeitosAtivos()[0]), 'a saída continua pendurada durante a montagem');

  // O TICK DA SAÍDA.
  relogio.t = 8;
  await M.verificarEfeitos(ctx);
  ok(temCondicao(alvo, 'imobilizado'), 'no Tick 8 a Prisão sai e o alvo fica Imobilizado');
  ok(registro.some((l) => /saiu/.test(l)), 'e o registro diz que ela saiu');
  ok(!M.deveSair(M.efeitosAtivos()[0]), 'a marca foi consumida');
  ok(!banco.tabelas.arena_efeitos[0].mordidos[M.A_SAIR],
    'e consumida NO BANCO também, senão um F5 a faria sair de novo');

  // E NÃO SAI DUAS VEZES. Este é o outro lado do defeito: com a marca voltando
  // do banco, a segunda passada resolvia tudo outra vez.
  const antes = (alvo.condicoes || []).length;
  relogio.t = 9;
  await M.verificarEfeitos(ctx);
  ok((alvo.condicoes || []).length === antes, 'no Tick 9 nada acontece de novo');
  ok(registro.filter((l) => /saiu/.test(l)).length === 1, 'e a Arte saiu UMA vez só');
}

conferir();
// =============================================== 2 · a mesma coisa, com dano
console.log('· Dardo com dano, Velocidade 4, conjurado no Tick 0 · sai no 3');
{
  const { ctx, alvo, relogio, registro } = cena({ tick: 0 });
  await M.gravarEfeito(ctx, ctx.combs[0], plano({
    efeito: { id: 'dardo', nome: 'Dardo', nivel: 2, grid: { forma: 'alvo', gatilho: 'imediato' } },
    nome: 'Dardo de Terra', danoDados: 4, velocidadeTicks: 4, turnos: 1,
  }), { forma: 'alvo', figura: null, alvos: ['a1'] });

  ok(alvo.pv_atual === 30, 'na declaração o alvo não perde Vida nenhuma');
  relogio.t = 2;
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === 30, 'e continua inteiro no Tick 2, um antes de o Dardo sair');

  relogio.t = 3;
  await M.verificarEfeitos(ctx);
  const depois = alvo.pv_atual;
  ok(depois < 30, `no Tick 3 o Dardo fere (Vida ${depois}/30)`);

  relogio.t = 4;
  await M.verificarEfeitos(ctx);
  ok(alvo.pv_atual === depois, 'e no Tick 4 não fere de novo: uma rolagem de dano, não duas');
  ok(registro.filter((l) => /saiu/.test(l)).length === 1, 'e uma linha de saída, não duas');
}

conferir();
// ================================ 3 · a ação livre continua saindo na hora
console.log('· ação livre (Velocidade 0) · sai no instante em que é declarada');
{
  const { ctx, alvo } = cena({ tick: 5 });
  await M.gravarEfeito(ctx, ctx.combs[0], plano({ velocidadeTicks: 0 }), { forma: 'alvo', figura: null, alvos: ['a1'] });
  ok(temCondicao(alvo, 'imobilizado'), 'a Arte de Velocidade 0 sai agora, sem pendurar nada');
  ok(!M.deveSair(M.efeitosAtivos()[0]), 'e não nasce devendo saída nenhuma');
}

conferir();
// ========================= 4 · o efeito ANTIGO, gravado antes do conserto
console.log('· efeito no chão de antes do conserto · não sai de novo');
{
  const { ctx, alvo, relogio, banco } = cena({ tick: 10 });
  // Sem marca nenhuma, que é o que toda linha gravada antes de 04/09 tem.
  banco.tabelas.arena_efeitos.push({
    id: 'velho', arena_id: 'ar1', nome: 'Prisão antiga', forma: 'alvo',
    gatilho: 'passivo', condicao: 'imobilizado', alvos: ['a1'],
    dano_dados: 0, dano_bonus: 0, elemento: null, materia: null,
    desde_tick: 2, ate_tick: 60, mordidos: {}, nivel: 3,
  });
  await M.carregarEfeitos(ctx);
  relogio.t = 11;
  await M.verificarEfeitos(ctx);
  ok(!temCondicao(alvo, 'imobilizado'),
    'a marca é de DEVE e não de JÁ SAIU: o que é velho fica como está, sem sair uma segunda vez');
}



// ============================ N · a marca da mordida nao atropela a dos outros
//
// O DEFEITO QUE ESTA CENA PRENDE (L43): os quatro pontos que escrevem `mordidos`
// montavam o mapa a partir da COPIA EM MEMORIA e mandavam o objeto INTEIRO. Com
// duas abas escrevendo o mesmo campo, e um dialogo humano no meio, quem grava
// por ultimo apaga a marca de quem gravou antes. A consequencia esta escrita no
// `sairDaArea`: o efeito volta a poder pegar quem ja pegou, e quem tenta escapar
// rola a fuga duas vezes sem entender por que.
//
// O PONTO ESCOLHIDO E A SAIDA DA ARTE, e nao a mordida, por um motivo de
// bancada: a mordida passa por uma caixa de dialogo, e esta bancada nao tem
// tela. A saida roda sozinha e usa o MESMO helper, tirando chave em vez de por.
// Se a fusao estiver certa aqui, esta certa nos quatro.
//
// A DIVERGENCIA E MONTADA DO JEITO QUE ELA ACONTECE: a marca da outra aba entra
// SO NA LINHA DO BANCO, com objeto novo, e a memoria desta aba continua sem
// saber dela. Mutar o objeto que ja esta la nao serviria · o `daLinha` guarda a
// MESMA referencia, entao a memoria enxergaria a mudanca e a cena mediria nada.
console.log('\n· tirar a marca da saida nao apaga a mordida que outra aba gravou');
{
  const { ctx, banco, relogio } = cena({ tick: 3 });
  // O `ATIVOS` e global do modulo e as cenas anteriores deixaram efeito nele:
  // sem esta linha o `[0]` seria de outra cena, contra um banco novo e vazio.
  await M.carregarEfeitos(ctx);
  await M.gravarEfeito(ctx, ctx.combs[0], plano(), { forma: 'alvo', figura: null, alvos: ['a1'] });
  const ef = M.efeitosAtivos()[0];
  ok(!!ef && M.deveSair(ef), 'a Arte nasce devendo a saida (`__a_sair` na memoria e no banco)');

  const linha = banco.tabelas.arena_efeitos[0];
  // OUTRA ABA MORDEU ALGUEM. Objeto NOVO, so no banco.
  linha.mordidos = { ...(linha.mordidos || {}), outro: 1 };
  ok(ef.mordidos.outro == null, 'e esta aba NAO sabe da mordida da outra: e essa a foto velha');

  relogio.t = 9;
  await M.verificarEfeitos(ctx);

  const m = banco.tabelas.arena_efeitos[0].mordidos || {};
  ok(m.__a_sair == null, `a Arte saiu: a marca da saida foi tirada (${Object.keys(m).join(', ') || 'mapa vazio'})`);
  // O PAR, e sem ele a primeira passa com o mapa inteiro trocado.
  ok(m.outro === 1, 'e a mordida que a OUTRA aba gravou continua la: tirar uma chave nao apaga as outras');
}

console.log('');
if (FALHAS.length) {
  console.log(`✗ Arte na mesa: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  for (const f of FALHAS) console.log(`   · ${f}`);
  process.exit(1);
}
console.log(`✓ Arte na mesa OK · ${PASSOU} asserções · a Arte não sai cedo, não sai duas vezes,`
  + ' e o caminho da MESA está sob teste');
