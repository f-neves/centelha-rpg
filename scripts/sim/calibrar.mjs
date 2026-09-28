// calibrar.mjs · linha de base para a calibração das Proezas.
//
// Duas camadas:
//   exata · convolução de acerto e dano, com golpes iid e Defesa cheia;
//   fiel  · motor.mjs até um lado cair, sem fuga/desistência automáticas.
//
// O script não altera regra nem catálogo. As alavancas são modificadores da
// peça ou wrappers locais das funções entregues ao motor.
//
// A REGRA DO QUASE-ACERTO (27/09/2026) já mora em `lance.ts` (o piso do item 2c
// é incondicional em `resolverGolpe`), e por isso os cenários locais V1/V2/V3
// que este arquivo carregava (comparação de variantes de Absorção que nunca
// foram adotadas) saíram: só existe a regra viva agora, e uma célula por
// combinação, não seis.
//
// Uso:
//   node scripts/sim/calibrar.mjs --n 1000
//   node scripts/sim/calibrar.mjs --teste
//   node scripts/sim/calibrar.mjs --n 1000 --pular B,A,C,Briga
//
// `--pular` existe para o conserto que só mexe numa fatia da conta (item 1/2/3
// do despacho "Três consertos na bancada", 28/09/2026): as seções puladas não
// são recalculadas, e o texto delas é copiado VERBATIM do relatório anterior
// (o que já está em `--saida`, lido antes de sobrescrever). Sem isto, provar
// que um conserto pequeno não mudou nada fora dele custaria a bateria inteira
// de novo, todo. As chaves aceitas são `A`, `B`, `C`, `Briga` (a seção 6b).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { carregarLib, ligar, RAIZ } from './lib-ponte.mjs';
import { batalha } from './motor.mjs';
import { iniciativaDaPeca, tipoDaExpressao } from './elenco.mjs';
import BASE from '../fixtures/kael.json' with { type: 'json' };
import REGRAS from '../../src/data/regras.json' with { type: 'json' };

const aqui = fileURLToPath(import.meta.url);
const arg = (nome, padrao) => {
  const i = process.argv.indexOf(nome);
  return i >= 0 ? process.argv[i + 1] : padrao;
};
const N = Number.parseInt(arg('--n', '1000'), 10);
const SEMENTE = Number.parseInt(arg('--semente', '20260927'), 10);
// FASE 5 (Reforma da Centelha, 28/09/2026): grade de fichas de referência, relatório PRÓPRIO
// (16), sem tocar o relatório 15 nem as seções A-E da grade de soma 6/8/12 (que continuam
// servindo a próxima calibração de Proezas). `--centelha` troca o padrão de `--saida` e desvia
// para `rodarFase5()`, definida perto do fim do arquivo.
const CENTELHA_MODE = process.argv.includes('--centelha');
const SAIDA = path.resolve(RAIZ, arg('--saida', CENTELHA_MODE
  ? 'docs/calibracao/16-linha-de-base-centelha.md'
  : 'docs/calibracao/15-linha-de-base.md'));
const TESTE = process.argv.includes('--teste');
const PULAR = new Set((arg('--pular', '') || '').split(',').map((x) => x.trim()).filter(Boolean));
const ANTERIOR = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, 'utf8') : null;
if (PULAR.size && !ANTERIOR) throw new Error(`--pular pede um relatório anterior em ${SAIDA}, e ele não existe`);

/** Copia um trecho do relatório ANTERIOR, do título dado até o próximo `## `/`### ` do mesmo nível. */
function secaoAnterior(titulo) {
  const linhas = ANTERIOR.split('\n');
  const i = linhas.findIndex((l) => l.trim() === titulo);
  if (i < 0) throw new Error(`--pular não achou a seção "${titulo}" no relatório anterior`);
  const nivel = titulo.match(/^#+/)[0].length;
  let j = i + 1;
  while (j < linhas.length && !(linhas[j].match(/^#{1,6}\s/) && linhas[j].match(/^#+/)[0].length <= nivel)) j++;
  return linhas.slice(i, j).join('\n').replace(/\n+$/, '') + '\n';
}
const ARMAS = ['espada-longa', 'montante'];
const ARMADURAS = ['nenhuma', 'gambeson', 'malha'];
const SOMAS = [6, 8, 12];
const CENTELHAS = [0, 1, 2, 3, 4, 5, 6];
const CS = [1, 3, 5];
const ALAVANCAS = [
  'ataque+1', 'defesa+1', 'dano+1', 'dano+1d6', 'absorcao+1',
  'pv+1', 'pv+5', 'preparo-1', 'recuperacao-1', 'habilidade+1',
  'atributo+1-destreza-espada',
];
const BASE_PV = REGRAS.derivados.pv.base + 3 * REGRAS.derivados.pv.vigorMult;

const L0 = await carregarLib();
ligar(L0);

const splitSoma = (soma) => ({ atributo: Math.floor(soma / 2), habilidade: Math.ceil(soma / 2) });
const copiar = (x) => structuredClone(x);
const pct = (x) => `${(100 * x).toFixed(1).replace('.', ',')}%`;
const num = (x, n = 2) => Number.isFinite(x) ? x.toFixed(n).replace('.', ',') : 'n/d';
const quantil = (xs, q) => {
  if (!xs.length) return null;
  const a = [...xs].sort((x, y) => x - y);
  return a[Math.min(a.length - 1, Math.floor((a.length - 1) * q))];
};
const media = (xs) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const addExpr = (expr, { flat = 0, dados = 0 } = {}) => {
  const m = String(expr).match(/^(\d+)d6(?:(?:\s*|)([+−-])\s*(\d+))?(.*)$/);
  if (!m) throw new Error(`expressão não reconhecida: ${expr}`);
  const atual = m[2] ? (m[2] === '+' ? 1 : -1) * Number(m[3]) : 0;
  const f = atual + flat;
  return `${Number(m[1]) + dados}d6${f ? ` ${f >= 0 ? '+' : '−'}${Math.abs(f)}` : ''}${m[4] || ''}`;
};

function fichaDe({ soma, centelha, arma, armadura, alavanca = null }) {
  const { atributo, habilidade } = splitSoma(soma);
  const f = copiar(BASE);
  f.centelha = centelha;
  f.attrs = { ...f.attrs, forca: atributo, destreza: atributo, vigor: 3 };
  f.skills = { ...f.skills, armas: habilidade, esquiva: habilidade, atletismo: habilidade };
  if (alavanca === 'habilidade+1') f.skills.armas += 1;
  if (alavanca === 'atributo+1-forca-montante') f.attrs.forca += 1;
  if (alavanca === 'atributo+1-destreza-espada') f.attrs.destreza += 1;
  // A adaga apenas ocupa a segunda mão para a espada longa usar a fórmula de
  // uma mão; a política simples do motor nunca declara ataque com ela.
  f.conjuntos = [{
    ativo: true,
    habil: { ref: `a:${arma}` },
    inabil: { ref: arma === 'espada-longa' ? 'a:adaga' : 'nada' },
  }];
  f.equip = { armaduras: armadura === 'nenhuma' ? [] : [{ base: armadura, vestida: true }] };
  return f;
}

/**
 * A FICHA DE BRIGA (desarmado), para a alavanca nova do item 6c. `armas.json`
 * lista `desarmado` com `pericia: 'briga'` (`src/lib/combate-resumo.ts:85` lê
 * `skills[w.pericia] || skills2[w.pericia]`), e "Briga" não é uma das 12
 * primárias da ficha de fixação nem está no catálogo de secundárias: é lida
 * pela MESMA chave que o bestiário já usa para bicho desarmado. Somar aqui é
 * só isso: `skills2.briga`, com a mesma divisão Atributo/Habilidade da soma.
 */
function fichaBrigaDe({ soma, centelha }) {
  const { atributo, habilidade } = splitSoma(soma);
  const f = copiar(BASE);
  f.centelha = centelha;
  f.attrs = { ...f.attrs, forca: atributo, destreza: atributo, vigor: 3 };
  f.skills = { ...f.skills, esquiva: habilidade, atletismo: habilidade };
  f.skills2 = { ...f.skills2, briga: habilidade };
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' } }];
  f.equip = { armaduras: [] };
  return f;
}

function perfilDe(opts) {
  const r = L0.resumoCombatePC(fichaDe(opts));
  const arma = L0.armaDoCatalogo(r.arma);
  const classe = L0.classeDeTempo(r.arma, null, null);
  const velocidade = L0.velocidadeDaArma(r.arma, 5);
  const al = opts.alavanca;
  const pvExtra = al === 'pv+5' ? 5 : al === 'pv+1' ? 1 : 0;
  const soakExtra = al === 'absorcao+1' ? 1 : 0;
  const soak = Object.fromEntries(Object.entries(r.soak).map(([k, v]) => [k, Math.max(0, v + soakExtra)]));
  return {
    nome: `S${opts.soma} C${opts.centelha}`,
    arma: r.arma, classe, velocidade,
    ataque: addExpr(r.ataque, { flat: al === 'ataque+1' ? 1 : 0 }),
    dano: addExpr(r.dano, {
      flat: al === 'dano+1' ? 1 : 0,
      dados: al === 'dano+1d6' ? 1 : 0,
    }),
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    defesa: r.defesa + (al === 'defesa+1' ? 1 : 0),
    pvMax: BASE_PV + pvExtra,
    soak,
    passo: r.passo,
    alcanceHex: classe === 'haste' ? 2 : 1,
    iniciativaBase: 6 + (r.atributos.raciocinio || 0),
    raciocinio: r.atributos.raciocinio || 0,
    qa: r.qa,
    centelha: opts.centelha,
    alavanca: al,
  };
}

function perfilBrigaDe(opts) {
  const r = L0.resumoCombatePC(fichaBrigaDe(opts));
  const classe = L0.classeDeTempo(r.arma, null, null);
  const velocidade = L0.velocidadeDaArma(r.arma, 5);
  return {
    nome: `Briga S${opts.soma} C${opts.centelha}`,
    arma: r.arma, classe, velocidade,
    ataque: r.ataque, dano: r.dano,
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    defesa: r.defesa, pvMax: BASE_PV,
    soak: r.soak, passo: r.passo,
    alcanceHex: 1,
    iniciativaBase: 6 + (r.atributos.raciocinio || 0),
    raciocinio: r.atributos.raciocinio || 0,
    qa: r.qa, centelha: opts.centelha, alavanca: null,
  };
}

function libDaBancada({ pressaoCap = null } = {}) {
  return {
    ...L0,
    decisaoAutomatica: (eu, inimigos, distancia, opts) => L0.decisaoAutomatica(
      { ...eu, pvPct: 100 }, inimigos, distancia, { ...opts, limiarFugaPct: -1 }),
    defesaPerdida: (acao, tick, opts) => {
      const d = L0.defesaPerdida(acao, tick, opts);
      if (pressaoCap == null) return d;
      const pressao = Math.max(d.pressao, -Math.abs(pressaoCap));
      return { ...d, pressao, total: d.acao + pressao };
    },
  };
}

function ajustarAnatomia(c, a) {
  if (c.alavanca === 'preparo-1' && a.preparo > 0) return {
    ...a, preparo: a.preparo - 1, ciclo: Math.max(1, a.ciclo - 1),
    offs: a.offs.map((x) => Math.max(0, x - 1)),
  };
  if (c.alavanca === 'recuperacao-1' && a.recuperacao > 0) return {
    ...a, recuperacao: a.recuperacao - 1, ciclo: Math.max(1, a.ciclo - 1),
  };
  return a;
}

/**
 * O CICLO DE UM ATAQUE SIMPLES, em Ticks (Preparo + Golpe + Recuperação).
 *
 * É o denominador da força por Tick (item 6b): duas peças podem precisar do
 * mesmo número de golpes para derrubar uma a outra e ainda assim uma ser mais
 * rápida na vida real, porque o montante demora mais Ticks por golpe que a
 * espada longa. Sem isto, "força relativa" só compara DANO POR TENTATIVA, e
 * tentativa não é tempo.
 */
function cicloDaPeca(p) {
  const a = L0.anatomia({ classe: p.classe, velocidade: p.velocidade, sistema: 'simultaneo', manobra: 'simples', golpes: 1 });
  // O CICLO TEM DE PASSAR PELO MESMO AJUSTE que a luta de verdade aplica
  // (`ajustarAnatomia`, usado dentro de `batalha`): sem isto, `preparo-1` e
  // `recuperacao-1` mediam a força por Tick com o ciclo CRU da arma, e as duas
  // alavancas saíam com força/Tick idêntica à força/tentativa (achado do
  // autor, 28/09/2026, lendo o `15-linha-de-base.md`).
  return ajustarAnatomia(p, a).ciclo;
}

function cenaDe(A, B, { nB = 1, semente = 1 } = {}) {
  const mapa = { cols: 20, rows: 20 };
  const pecas = [];
  const posB = [{ q: 6, r: 5 }, { q: 5, r: 6 }, { q: 6, r: 4 }];
  const todos = [[A, 'a', 0, { q: 5, r: 5 }], ...Array.from({ length: nB }, (_, i) => [B, 'b', i, posB[i]])];
  for (let ordinal = 0; ordinal < todos.length; ordinal++) {
    const [arq, lado, k, pos] = todos[ordinal];
    pecas.push({
      ...copiar(arq), id: `${lado}${k}`, lado, nome: `${arq.nome} ${lado}${k}`,
      iniciativa: iniciativaDaPeca(arq, ordinal, semente), pv: arq.pvMax,
      pos, mapa, acao: null, fase: 'livre', pressao: 0, deslizes: 0,
      manobra: 'simples', tick: 0, ordinal,
    });
  }
  const entradas = L0.ticksDeEntrada(pecas.map((x) => x.iniciativa));
  pecas.forEach((x, i) => {
    x.tick = entradas[i].tick;
    x.acao = entradas[i].penDados
      ? { golpes: [], livre: entradas[i].tick, contrape: entradas[i].penDados, contrapeDesde: entradas[i].tick }
      : {};
  });
  return { pecas, escala: 1, mapa, celula: { id: 'calibracao', limiar: -1 }, semente };
}

function logCalibracao() {
  const lances = [];
  const quedas = [];
  return {
    lances, quedas,
    tick() {}, parada() {}, decl() {}, chegou() {}, andou() {}, fugiu() {}, fimDoTick() {}, fim() {},
    dano(c, alvo, t, o) { lances.push({ de: c.id, para: alvo.id, t, ...o }); },
    caiu(c, t) { quedas.push({ id: c.id, t }); },
  };
}

function lutaFiel(A, B, { nB = 1, pressaoCap = null, seed = 1 } = {}) {
  const cena = cenaDe(A, B, { nB, semente: seed });
  const log = logCalibracao();
  const perdas = [];
  const L = libDaBancada({ pressaoCap });
  L.semear(L.semeadoDe(seed));
  const res = batalha(L, cena, log, {
    ateCair: true, teto: 1000, ajustarAnatomia,
    lance: (x) => perdas.push({ ladoAlvo: x.para[0], valor: -x.entrada.alvo.defesaPerdida, veredito: x.saida.veredito }),
  });
  const vivosA = cena.pecas.filter((x) => x.lado === 'a' && x.pv > 0).length;
  const acoesA = log.lances.filter((x) => x.de[0] === 'a').length;
  const acoesB = log.lances.filter((x) => x.de[0] === 'b').length;
  const vivosB = cena.pecas.filter((x) => x.lado === 'b' && x.pv > 0).length;
  const resolvida = res.fim === 'sem-ninguem-de-pe';
  const acoesAteCair = resolvida ? (vivosA > 0 ? acoesA : acoesB) : null;
  return {
    venceuA: resolvida ? vivosA > 0 && vivosB === 0 : null,
    resolvida, fim: res.fim, ticks: res.ticks, perdas,
    acoesA, acoesB, lances: log.lances,
    acoesAteCair,
  };
}

function rodarFiel(conf, reps = N) {
  const rs = [];
  for (let i = 0; i < reps; i++) rs.push(lutaFiel(conf.A, conf.B, { ...conf, seed: SEMENTE + i * 7919 }));
  const lances = rs.flatMap((x) => x.lances);
  const perdas = rs.flatMap((x) => x.perdas.map((p) => p.valor));
  const resolvidas = rs.filter((x) => x.resolvida);
  const acoes = resolvidas.map((x) => x.acoesAteCair);
  const porA = lances.filter((x) => x.de[0] === 'a');
  const porB = lances.filter((x) => x.de[0] === 'b');
  const direcao = (xs, pvAlvo) => {
    const total = xs.reduce((z, x) => z + (x.danoLiquido || 0), 0);
    const dano = xs.length ? total / xs.length : 0;
    return { total, n: xs.length, dano, golpes: dano > 0 ? pvAlvo / dano : Infinity };
  };
  return {
    vitoriaA: resolvidas.length ? resolvidas.filter((x) => x.venceuA).length / resolvidas.length : null,
    vitoriasA: resolvidas.filter((x) => x.venceuA).length,
    resolvidas: resolvidas.length,
    total: rs.length,
    censura: 1 - resolvidas.length / rs.length,
    lancesN: lances.length,
    acertosN: lances.filter((x) => x.veredito === 'acerto').length,
    raspoesN: lances.filter((x) => x.veredito === 'raspao').length,
    acerto: lances.filter((x) => x.veredito === 'acerto').length / Math.max(1, lances.length),
    raspao: lances.filter((x) => x.veredito === 'raspao').length / Math.max(1, lances.length),
    danoTentativa: lances.reduce((z, x) => z + (x.danoLiquido || 0), 0) / Math.max(1, lances.length),
    acoes: { p10: quantil(acoes, .1), p50: quantil(acoes, .5), p90: quantil(acoes, .9), media: media(acoes) },
    _acoes: acoes,
    dirA: direcao(porA, conf.B.pvMax),
    dirB: direcao(porB, conf.A.pvMax),
    perdas: { media: media(perdas), p10: quantil(perdas, .1), p50: quantil(perdas, .5), p90: quantil(perdas, .9), n: perdas.length },
  };
}

function wilson(k, n, z = 1.959964) {
  if (!n) return { p: null, lo: null, hi: null, n };
  const p = k / n, z2 = z * z, den = 1 + z2 / n;
  const meio = (p + z2 / (2 * n)) / den;
  const margem = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n) / den;
  return { p, lo: meio - margem, hi: meio + margem, n };
}

function juntarDirecao(a, b, pvAlvo) {
  const total = a.total + b.total, n = a.n + b.n;
  const dano = n ? total / n : 0;
  return { total, n, dano, golpes: dano > 0 ? pvAlvo / dano : Infinity };
}

/** golpes → Ticks: divide o dano por tentativa pelo ciclo do atacante, em Ticks. */
const golpesParaTicks = (dir, cicloTicks) => dir.dano > 0 ? dir.golpes * cicloTicks : Infinity;

const relForca = (numGolpes, denGolpes) =>
  Number.isFinite(numGolpes) && Number.isFinite(denGolpes) ? numGolpes / denGolpes
    : denGolpes < numGolpes ? Infinity : denGolpes > numGolpes ? 0 : null;

function rodarEspelho(conf, reps = N) {
  const ida = rodarFiel(conf, reps);
  const volta = rodarFiel({ ...conf, A: conf.B, B: conf.A }, reps);
  const vitoriasComoA = ida.vitoriasA;
  const vitoriasComoB = volta.resolvidas - volta.vitoriasA;
  const resolvidas = ida.resolvidas + volta.resolvidas;
  const ic = wilson(vitoriasComoA + vitoriasComoB, resolvidas);
  const dirA = juntarDirecao(ida.dirA, volta.dirB, conf.B.pvMax);
  const dirB = juntarDirecao(ida.dirB, volta.dirA, conf.A.pvMax);
  // FORÇA POR TENTATIVA (a métrica antiga, golpes necessários) e FORÇA POR
  // TICK (item 6b, a métrica principal agora): as duas convivem porque
  // discordam justamente quando o ciclo das duas armas difere (a pesada bate
  // mais forte por golpe, mas gasta mais Ticks por golpe).
  const forca = relForca(dirB.golpes, dirA.golpes);
  const cicloA = cicloDaPeca(conf.A), cicloB = cicloDaPeca(conf.B);
  const ticksA = golpesParaTicks(dirA, cicloA), ticksB = golpesParaTicks(dirB, cicloB);
  const forcaTick = relForca(ticksB, ticksA);
  // O LIMIAR É 15%, E NÃO 20% (achado do autor, 28/09/2026, lendo o
  // `15-linha-de-base.md`): `preparo-1`/`recuperacao-1` COM A MESMA ARMA dos
  // dois lados (ciclo 6 → 5) discordam por um fator de EXATAMENTE 6/5 = 1,2,
  // que é 16,7% de diferença relativa ao maior dos dois valores. Com 20% essa
  // linha, que é o próprio critério de aceite do conserto do item 1, não
  // carregava `⚑`.
  const discorda = forca != null && forcaTick != null
    && ((forca - 1) * (forcaTick - 1) < 0 // sinais diferentes: uma favorece A, a outra B
      || (Number.isFinite(forca) && Number.isFinite(forcaTick) && Math.max(forca, forcaTick) > 0
        && Math.abs(forca - forcaTick) / Math.max(forca, forcaTick, 1e-9) > .15));
  const acoes = [...ida._acoes, ...volta._acoes];
  const comoA = ida.resolvidas ? vitoriasComoA / ida.resolvidas : null;
  const comoB = volta.resolvidas ? vitoriasComoB / volta.resolvidas : null;
  return {
    ida, volta, dirA, dirB, forca, forcaTick, discorda, cicloA, cicloB, ticksA, ticksB, ic,
    vitoriaA: ic.p,
    vies: comoA == null || comoB == null ? null : comoA - comoB,
    censura: 1 - resolvidas / (ida.total + volta.total),
    acerto: (ida.acertosN + volta.acertosN) / Math.max(1, ida.lancesN + volta.lancesN),
    raspao: (ida.raspoesN + volta.raspoesN) / Math.max(1, ida.lancesN + volta.lancesN),
    acoes: { p10: quantil(acoes, .1), p50: quantil(acoes, .5), p90: quantil(acoes, .9), media: media(acoes) },
  };
}

// ---------------- camada exata: distribuições de um golpe e de ações até cair
const conv = (a, b) => {
  const out = Array(a.length + b.length - 1).fill(0n);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) out[i + j] += a[i] * b[j];
  return out;
};
const d6Dist = (n) => {
  let a = [1n];
  for (let i = 0; i < n; i++) a = conv(a, [0n, 1n, 1n, 1n, 1n, 1n, 1n]);
  return a;
};
const parseExpr = (expr) => {
  const m = String(expr).match(/^(\d+)d6(?:(?:\s*|)([+−-])\s*(\d+))?/);
  return { dados: Number(m[1]), flat: m[2] ? (m[2] === '+' ? 1 : -1) * Number(m[3]) : 0 };
};
function golpeExato(A, B, defesaPerdida = 0) {
  const at = parseExpr(A.ataque), da = parseExpr(A.dano);
  const ad = d6Dist(at.dados), dd = d6Dist(da.dados);
  const denA = 6 ** at.dados, denD = 6 ** da.dados;
  const defesa = B.defesa - defesaPerdida;
  const dano = new Map(); let hit = 0, raspao = 0;
  // O RASPÃO PASSA PELA FONTE ÚNICA (`quaseAcertoDoEncontro`, `src/lib/lance.ts`), e não por
  // uma conta manual: a Reforma da Centelha (28/09/2026) somou a Centelha do ATACANTE ao lado
  // da do alvo, e uma reimplementação aqui já tinha ficado sem os dois termos antes disto
  // (achado ao preparar a Fase 5, coberto porque os dois pontos de concordância de `testes()`
  // usam Centelha 0 dos dois lados, e o teste manual usa A.centelha === B.centelha, que cancela
  // por coincidência).
  const qaEncontro = L0.quaseAcertoDoEncontro({
    atacante: { qaArmaBonus: A.qa.armaBonus, qaArmaDano: A.qa.armaDano, centelha: A.centelha },
    alvo: { qaArmaduraBonus: B.qa.armaduraBonus, qaArmaduraReducao: B.qa.armaduraReducao, centelha: B.centelha },
  });
  for (let r = 0; r < ad.length; r++) {
    const ca = Number(ad[r]); if (!ca) continue;
    const total = r + at.flat;
    if (total > defesa) {
      hit += ca;
      // A Margem é informativa no lance atual; não acrescenta dado ao dano.
      const distD = dd;
      const denM = denD;
      // O PISO DO ITEM 2C É INCONDICIONAL na regra viva desde 27/09/2026: o
      // acerto nunca dói menos que o raspão do mesmo golpe.
      const piso = qaEncontro.dano;
      for (let d = 0; d < distD.length; d++) {
        const normal = Math.max(0, d + da.flat - (B.soak[A.tipoDano] || 0));
        const liq = Math.max(normal, piso);
        dano.set(liq, (dano.get(liq) || 0) + ca * Number(distD[d]) / denM);
      }
    } else if (defesa - total + 1 <= qaEncontro.margem) {
      raspao += ca;
      const liq = qaEncontro.dano;
      dano.set(liq, (dano.get(liq) || 0) + ca);
    } else dano.set(0, (dano.get(0) || 0) + ca);
  }
  for (const [k, v] of dano) dano.set(k, v / denA);
  const e = [...dano].reduce((z, [d, q]) => z + d * q, 0);
  return { hit: hit / denA, raspao: raspao / denA, dano: e, dist: dano };
}

function acoesExatas(A, B, defesaPerdida = 0, teto = 200) {
  const g = golpeExato(A, B, defesaPerdida);
  let vivos = new Map([[B.pvMax, 1]]), caiu = 0, anterior = 0;
  const cdf = [];
  for (let acao = 1; acao <= teto; acao++) {
    const prox = new Map();
    for (const [pv, p] of vivos) for (const [d, q] of g.dist) {
      if (pv - d <= 0) caiu += p * q;
      else prox.set(pv - d, (prox.get(pv - d) || 0) + p * q);
    }
    vivos = prox; cdf.push(caiu);
    if (caiu > .999999) break;
    if (Math.abs(caiu - anterior) < 1e-15 && g.dano === 0) break;
    anterior = caiu;
  }
  const q = (p) => { const i = cdf.findIndex((x) => x >= p); return i < 0 ? null : i + 1; };
  const expectativa = cdf.reduce((z, x, i) => z + (1 - (i ? cdf[i - 1] : 0)), 0);
  return { ...g, p10: q(.1), p50: q(.5), p90: q(.9), media: expectativa };
}

function mdTabela(cab, rows) {
  return `| ${cab.join(' | ')} |\n|${cab.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}\n`;
}
const qs = (a) => a.p50 == null ? 'não concluiu' : `${a.p10}/${a.p50}/${a.p90}`;
const qex = (a) => [a.p10, a.p50, a.p90].map((x) => x == null ? '>200' : x).join('/');
const icPct = (ic) => ic.p == null ? 'n/d' : `${pct(ic.p)} [${pct(ic.lo)}; ${pct(ic.hi)}], n=${ic.n}`;
const pp = (x) => x == null ? 'n/d' : `${(x * 100).toFixed(1).replace('.', ',')} pp`;
const golpes = (x) => Number.isFinite(x) ? num(x) : '∞';
const ticks = (x) => Number.isFinite(x) ? num(x, 1) : '∞';

function chave(o) { return `${o.soma}/${o.centelha}/${o.arma}/${o.armadura}`; }
function base(soma, centelha, arma = 'espada-longa', armadura = 'gambeson', alavanca = null) {
  return perfilDe({ soma, centelha, arma, armadura, alavanca });
}

function testes() {
  const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
  const A = base(8, 3, 'espada-longa', 'gambeson');
  const B = base(8, 3, 'espada-longa', 'gambeson');
  const qaAB = L0.quaseAcertoDoEncontro({
    atacante: { qaArmaBonus: A.qa.armaBonus, qaArmaDano: A.qa.armaDano, centelha: A.centelha },
    alvo: { qaArmaduraBonus: B.qa.armaduraBonus, qaArmaduraReducao: B.qa.armaduraReducao, centelha: B.centelha },
  });
  const casos = [
    { nome: 'erro', a: 10, d: 5, defesaPerdida: 0, esperado: ['erro', 0] },
    { nome: 'raspão', a: B.defesa - qaAB.margem + 1, d: 5, defesaPerdida: 0,
      esperado: ['raspao', qaAB.dano] },
    { nome: 'acerto', a: B.defesa + 7, d: 9, defesaPerdida: 0,
      esperado: ['acerto', Math.max(Math.max(0, 9 - B.soak.corte), qaAB.dano)] },
  ];
  for (const c of casos) {
    const entrada = {
      atacante: { ataque: A.ataque, dano: A.dano, ajusteDados: 0, ajusteFlat: 0, penDados: [0], qaArmaBonus: A.qa.armaBonus, qaArmaDano: A.qa.armaDano },
      alvo: { defesaBase: B.defesa, ferimento: 0, condicoesDefesa: 0, defesaPerdida: c.defesaPerdida, soak: B.soak.corte, pv: B.pvMax, pvMax: B.pvMax, qaArmaduraBonus: B.qa.armaduraBonus, qaArmaduraReducao: B.qa.armaduraReducao, centelha: B.centelha },
      golpeIndice: 0, margemQA: qaAB.margem,
      danoQA: qaAB.dano, tipoDano: 'corte', modManual: 0,
    };
    const out = L0.resolverGolpe(entrada, { rolar: (() => { const q = [{ total: c.a, rolls: [] }, { total: c.d, rolls: [] }]; let i = 0; return () => q[i++]; })() });
    assert(out.veredito === c.esperado[0], `${c.nome}: veredito ${out.veredito}`);
    assert(out.danoLiquido === c.esperado[1], `${c.nome}: dano ${out.danoLiquido}`);
  }
  // A camada exata e resolverGolpe concordam em dois pontos de probabilidade,
  // pois ambos usam a mesma desigualdade, Margem, QA e Absorção, e agora os
  // dois lados PASSAM pela mesma fonte única (`quaseAcertoDoEncontro`), então a
  // Centelha do atacante e a do alvo (aqui iguais, X === X) entram nos dois
  // exatamente do mesmo jeito.
  for (const [s, c] of [[6, 1], [12, 5]]) {
    const X = base(s, c), ex = golpeExato(X, X, 0);
    let hit = 0, qa = 0, dano = 0; const distA = d6Dist(parseExpr(X.ataque).dados), denA = 6 ** parseExpr(X.ataque).dados;
    const at = parseExpr(X.ataque), da = parseExpr(X.dano), distD = d6Dist(da.dados), denD = 6 ** da.dados;
    const qaXX = L0.quaseAcertoDoEncontro({
      atacante: { qaArmaBonus: X.qa.armaBonus, qaArmaDano: X.qa.armaDano, centelha: X.centelha },
      alvo: { qaArmaduraBonus: X.qa.armaduraBonus, qaArmaduraReducao: X.qa.armaduraReducao, centelha: X.centelha },
    });
    for (let a = 0; a < distA.length; a++) for (let d = 0; d < distD.length; d++) {
      const w = Number(distA[a]) * Number(distD[d]) / denA / denD;
      const entrada = { atacante: { ataque: X.ataque, dano: X.dano, ajusteDados: 0, ajusteFlat: 0, penDados: [0], qaArmaBonus: X.qa.armaBonus, qaArmaDano: X.qa.armaDano }, alvo: { defesaBase: X.defesa, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0, soak: X.soak.corte, pv: X.pvMax, pvMax: X.pvMax, qaArmaduraBonus: X.qa.armaduraBonus, qaArmaduraReducao: X.qa.armaduraReducao, centelha: X.centelha }, golpeIndice: 0, margemQA: qaXX.margem, danoQA: qaXX.dano, tipoDano: 'corte', modManual: 0 };
      let i = 0; const rolls = [{ total: a + at.flat, rolls: [] }, { total: d + da.flat, rolls: [] }];
      const out = L0.resolverGolpe(entrada, { rolar: () => rolls[i++] });
      if (out.veredito === 'acerto') hit += w; else if (out.veredito === 'raspao') qa += w;
      dano += out.danoLiquido * w;
    }
    assert(Math.abs(hit - ex.hit) < 1e-12 && Math.abs(qa - ex.raspao) < 1e-12 && Math.abs(dano - ex.dano) < 1e-12, `concordância S${s} C${c}`);
  }
  const atual = base(8, 3, 'espada-longa', 'gambeson');
  assert(golpeExato(atual, atual).dano >= 0, 'a camada exata roda com a regra viva (piso incondicional)');
  const pv5 = juntarDirecao({ total: 100, n: 20 }, { total: 100, n: 20 }, 35);
  assert(pv5.golpes === 7, 'golpes direcionais devem incorporar PV do alvo');
  console.log('✓ calibrar: 3 golpes manuais e 2 pontos de concordância');
}

if (TESTE) { testes(); process.exit(0); }

// ============================================================ FASE 5 · fichas de referência
//
// Substitui a grade de soma 6/8/12 por QUATRO fichas de referência (Típica espada, Típica
// montante, Especialista ofensivo, Defensivo), Centelha 0-6, nas três armaduras (despacho
// "Reforma da Centelha, Briga, consertos e fichas de referência", Fase 5, 28/09/2026). Não
// altera `regras.json` nem dado de personagem: só a bancada.
//
// Índice 0..6 = Centelha 0..6 nas tabelas abaixo (o despacho já escreve os números nessa ordem).
const TIPICA_ESPADA = {
  destreza: [5, 5, 6, 6, 6, 6, 6],
  armas: [4, 5, 6, 6, 6, 6, 6],
  esquiva: [2, 3, 3, 4, 5, 5, 6],
  vigor: [3, 3, 4, 4, 5, 5, 6],
  arma: 'espada-longa',
};
const TIPICA_MONTANTE = {
  // "igual, com Força no lugar da Destreza para atacar e causar dano": copia a coluna de
  // Destreza da típica espada, agora em Força.
  forca: TIPICA_ESPADA.destreza,
  destreza: [3, 4, 4, 5, 5, 6, 6],
  armas: TIPICA_ESPADA.armas,
  esquiva: TIPICA_ESPADA.esquiva,
  vigor: TIPICA_ESPADA.vigor,
  arma: 'montante',
};
const ARQUETIPOS = ['espada', 'montante', 'especialista', 'defensivo'];

/**
 * Ficha de um arquétipo de referência, por Centelha (0-6) e armadura.
 *
 * DUAS SUPOSIÇÕES NÃO ESCRITAS NO DESPACHO, registradas aqui e repetidas no relatório: (1) o
 * Especialista ofensivo usa soma 12 (Destreza+Armas, 6/6) também em C0: o texto diz "desde C1"
 * sem dar o número de C0; (2) Especialista e Defensivo lutam com espada longa (a única arma que
 * o despacho amarra a um arquétipo com nome é a espada/montante das duas Típicas); Força e
 * Destreza de ataque de ambos usam a mesma convenção do resto do arquivo (a=Destreza, salvo
 * onde o despacho já diz o contrário).
 */
function fichaArquetipoDe({ arquetipo, centelha, armadura }) {
  const i = centelha;
  const f = copiar(BASE);
  f.centelha = centelha;
  let arma = 'espada-longa';
  if (arquetipo === 'espada' || arquetipo === 'montante') {
    const d = arquetipo === 'espada' ? TIPICA_ESPADA : TIPICA_MONTANTE;
    const destreza = d.destreza[i];
    const forca = d.forca ? d.forca[i] : destreza;
    f.attrs = { ...f.attrs, destreza, forca, vigor: d.vigor[i] };
    f.skills = { ...f.skills, armas: d.armas[i], esquiva: d.esquiva[i], atletismo: d.esquiva[i] };
    arma = d.arma;
  } else if (arquetipo === 'especialista') {
    f.attrs = { ...f.attrs, destreza: 6, forca: 6, vigor: 3 };
    f.skills = { ...f.skills, armas: 6, esquiva: 1, atletismo: 1 };
  } else if (arquetipo === 'defensivo') {
    const esquivaVal = Math.max(3, centelha);
    f.attrs = { ...f.attrs, destreza: 6, forca: 6, vigor: TIPICA_ESPADA.vigor[i] };
    f.skills = { ...f.skills, armas: 3, esquiva: esquivaVal, atletismo: esquivaVal };
  } else throw new Error(`arquétipo desconhecido: ${arquetipo}`);
  f.conjuntos = [{
    ativo: true, habil: { ref: `a:${arma}` },
    inabil: { ref: arma === 'espada-longa' ? 'a:adaga' : 'nada' },
  }];
  f.equip = { armaduras: armadura === 'nenhuma' ? [] : [{ base: armadura, vestida: true }] };
  return f;
}

/** A ficha "erudito" do item g: uma pessoa de Centelha 6 sem treino de combate (ou quase). */
function fichaEruditoDe({ armas = 0, esquiva = 0 } = {}) {
  const f = copiar(BASE);
  f.centelha = 6;
  f.attrs = { ...f.attrs, destreza: 2, forca: 2, vigor: 3 };
  f.skills = { ...f.skills, armas, esquiva, atletismo: esquiva };
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:espada-longa' }, inabil: { ref: 'a:adaga' } }];
  f.equip = { armaduras: [] };
  return f;
}

/** As mesmas 12 alavancas do item c da Fase 5, escritas exatamente como o despacho as nomeia. */
const ALAVANCAS_F5 = [
  'ataque+1', 'defesa+1', 'dano+1', 'dano+1d6', 'absorcao+1', 'pv+5',
  'preparo-1', 'recuperacao-1', 'habilidade+1', 'esquiva+1',
  'atributo+1-destreza-espada', 'atributo+1-forca-montante',
];

function perfilArquetipoDe({ arquetipo, centelha, armadura, alavanca = null }) {
  const ficha = fichaArquetipoDe({ arquetipo, centelha, armadura });
  if (alavanca === 'habilidade+1') ficha.skills.armas += 1;
  if (alavanca === 'esquiva+1') ficha.skills.esquiva += 1;
  if (alavanca === 'atributo+1-destreza-espada' && arquetipo === 'espada') ficha.attrs.destreza += 1;
  if (alavanca === 'atributo+1-forca-montante' && arquetipo === 'montante') ficha.attrs.forca += 1;
  const r = L0.resumoCombatePC(ficha);
  const arma = L0.armaDoCatalogo(r.arma);
  const classe = L0.classeDeTempo(r.arma, null, null);
  const velocidade = L0.velocidadeDaArma(r.arma, 5);
  const pvExtra = alavanca === 'pv+5' ? 5 : 0;
  const soakExtra = alavanca === 'absorcao+1' ? 1 : 0;
  const soak = Object.fromEntries(Object.entries(r.soak).map(([k, v]) => [k, Math.max(0, v + soakExtra)]));
  return {
    nome: `${arquetipo} C${centelha}`,
    arma: r.arma, classe, velocidade,
    ataque: addExpr(r.ataque, { flat: alavanca === 'ataque+1' ? 1 : 0 }),
    dano: addExpr(r.dano, { flat: alavanca === 'dano+1' ? 1 : 0, dados: alavanca === 'dano+1d6' ? 1 : 0 }),
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    defesa: r.defesa + (alavanca === 'defesa+1' ? 1 : 0),
    pvMax: BASE_PV + pvExtra,
    soak, passo: r.passo,
    alcanceHex: classe === 'haste' ? 2 : 1,
    iniciativaBase: 6 + (r.atributos.raciocinio || 0),
    raciocinio: r.atributos.raciocinio || 0,
    qa: r.qa, centelha, alavanca,
  };
}

function perfilEruditoDe(opts) {
  const r = L0.resumoCombatePC(fichaEruditoDe(opts));
  const classe = L0.classeDeTempo(r.arma, null, null);
  const velocidade = L0.velocidadeDaArma(r.arma, 5);
  return {
    nome: `erudito(${opts.armas ?? 0}/${opts.esquiva ?? 0})`,
    arma: r.arma, classe, velocidade,
    ataque: r.ataque, dano: r.dano,
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    defesa: r.defesa, pvMax: BASE_PV, soak: r.soak, passo: r.passo,
    alcanceHex: 1,
    iniciativaBase: 6 + (r.atributos.raciocinio || 0),
    raciocinio: r.atributos.raciocinio || 0,
    qa: r.qa, centelha: 6, alavanca: null,
  };
}

function rodarFase5() {
  console.log(`· Fase 5 (--n ${N}, semente ${SEMENTE})`);

  // a. Duração entre iguais por Centelha, ficha e armadura.
  const linhasA5 = [];
  for (const arq of ARQUETIPOS) for (const c of CENTELHAS) for (const arm of ARMADURAS) {
    const A = perfilArquetipoDe({ arquetipo: arq, centelha: c, armadura: arm });
    const fi = rodarEspelho({ A, B: A }, N);
    linhasA5.push([arq, c, arm, qs(fi.acoes), pct(fi.censura)]);
  }
  console.log('  · a (duração) concluído');

  // b. Degrau automático X+1 contra X (força por Tick, vitória e IC).
  const linhasB5 = [];
  for (const arq of ARQUETIPOS) for (const arm of ARMADURAS) for (let x = 0; x < 6; x++) {
    const A = perfilArquetipoDe({ arquetipo: arq, centelha: x + 1, armadura: arm });
    const B = perfilArquetipoDe({ arquetipo: arq, centelha: x, armadura: arm });
    const fi = rodarEspelho({ A, B }, N);
    linhasB5.push([
      arq, arm, `${x + 1}×${x}`, num(fi.forcaTick, 3), fi.discorda ? '⚑' : '',
      icPct(fi.ic), pp(fi.vies), pct(fi.censura),
    ]);
  }
  console.log('  · b (degrau automático) concluído');

  // c. Alavancas nas fichas típicas (espada, montante) em C1/C3/C5.
  const linhasC5 = [];
  for (const arq of ['espada', 'montante']) for (const c of CS) {
    const B = perfilArquetipoDe({ arquetipo: arq, centelha: c, armadura: 'gambeson' });
    for (const al of ALAVANCAS_F5) {
      const A = perfilArquetipoDe({ arquetipo: arq, centelha: c, armadura: 'gambeson', alavanca: al });
      const fi = rodarEspelho({ A, B }, N);
      linhasC5.push([
        arq, c, al, num(fi.forcaTick, 3), fi.discorda ? '⚑' : '',
        icPct(fi.ic), pp(fi.vies), pct(fi.censura),
      ]);
    }
  }
  console.log('  · c (alavancas) concluído');

  // d. Espada contra montante (fichas típicas), por Tick.
  const linhasD5 = [];
  for (const c of CENTELHAS) {
    const A = perfilArquetipoDe({ arquetipo: 'espada', centelha: c, armadura: 'gambeson' });
    const B = perfilArquetipoDe({ arquetipo: 'montante', centelha: c, armadura: 'gambeson' });
    const fi = rodarEspelho({ A, B }, N);
    linhasD5.push([c, num(fi.forcaTick, 3), fi.discorda ? '⚑' : '', icPct(fi.ic), pp(fi.vies), pct(fi.censura)]);
  }
  console.log('  · d (espada×montante) concluído');

  // e. Briga (soco novo) contra Armas (típica espada), sem armadura dos dois lados.
  const linhasE5 = [];
  for (const c of CENTELHAS) {
    const briga = perfilBrigaDe({ soma: TIPICA_ESPADA.destreza[c] + TIPICA_ESPADA.armas[c], centelha: c });
    const armas = perfilArquetipoDe({ arquetipo: 'espada', centelha: c, armadura: 'nenhuma' });
    const fi = rodarEspelho({ A: briga, B: armas }, N);
    linhasE5.push([c, num(fi.forcaTick, 3), fi.discorda ? '⚑' : '', icPct(fi.ic), pp(fi.vies), pct(fi.censura)]);
  }
  console.log('  · e (Briga×Armas) concluído');

  // f. 1 contra 2 e 1 contra 3, com a típica espada: X+1 contra grupo de X; X+2 contra X.
  const linhasF5 = [];
  for (const [nB, delta, rotulo] of [[2, 1, 'X+1 vs 2×X'], [3, 1, 'X+1 vs 3×X'], [2, 2, 'X+2 vs 2×X'], [3, 2, 'X+2 vs 3×X']]) {
    for (let x = 0; x + delta <= 6; x++) {
      const A = perfilArquetipoDe({ arquetipo: 'espada', centelha: x + delta, armadura: 'gambeson' });
      const B = perfilArquetipoDe({ arquetipo: 'espada', centelha: x, armadura: 'gambeson' });
      const fi = rodarFiel({ A, B, nB }, N);
      linhasF5.push([rotulo, x, fi.vitoriaA == null ? 'n/d' : pct(fi.vitoriaA), pct(fi.censura)]);
    }
  }
  console.log('  · f (grupo) concluído');

  // g. Conferência de sanidade: erudito de Centelha 6 sem treino vs a típica de Centelha 0;
  // depois o mesmo erudito com Armas 2 e Esquiva 2. Teste de DIREÇÃO, não de número exato.
  const tipicaC0 = perfilArquetipoDe({ arquetipo: 'espada', centelha: 0, armadura: 'nenhuma' });
  const eruditoFraco = perfilEruditoDe({ armas: 0, esquiva: 0 });
  const eruditoTreinado = perfilEruditoDe({ armas: 2, esquiva: 2 });
  const fiFraco = rodarEspelho({ A: eruditoFraco, B: tipicaC0 }, Math.max(N, 200));
  const fiTreinado = rodarEspelho({ A: eruditoTreinado, B: tipicaC0 }, Math.max(N, 200));
  const perdeSemTreino = fiFraco.vitoriaA != null && fiFraco.vitoriaA < 0.5;
  const resisteComTreino = fiTreinado.vitoriaA != null && fiTreinado.vitoriaA >= 0.5;
  const direcaoOk = perdeSemTreino && resisteComTreino;
  console.log(`  · g (sanidade) concluído${direcaoOk ? '' : ' · DIREÇÃO AO CONTRÁRIO DO ESPERADO'}`);
  if (!direcaoOk) {
    console.log(`    fraco: vitória A = ${fiFraco.vitoriaA}; treinado: vitória A = ${fiTreinado.vitoriaA}`);
    console.log('    PARE E RELATE (cláusula do despacho, item g): não seguindo para o relatório.');
    process.exitCode = 1;
  }

  const linhasG5 = [
    ['sem treino (Armas 0, Esquiva 0)', pct(fiFraco.vitoriaA ?? 0), num(fiFraco.dirA.dano), num(fiFraco.dirB.dano), pct(fiFraco.censura), perdeSemTreino ? 'perde (esperado)' : 'NÃO perde (inesperado)'],
    ['com Armas 2, Esquiva 2', pct(fiTreinado.vitoriaA ?? 0), num(fiTreinado.dirA.dano), num(fiTreinado.dirB.dano), pct(fiTreinado.censura), resisteComTreino ? 'resiste (esperado)' : 'NÃO resiste (inesperado)'],
  ];

  const md5 = `# 16 · Linha de base do combate por fichas de referência (Reforma da Centelha)

28/09/2026 · **RASCUNHO DE MEDIÇÃO**, Fase 5 do despacho "Reforma da Centelha, Briga, consertos e
fichas de referência". Nada deste relatório vale para preço antes da conferência da Revisora.
${N} lutas em cada orientação de cada célula, semente mestre ${SEMENTE}.

## Suposições não escritas no despacho (registradas para a Revisora corrigir se erradas)

1. O **Especialista ofensivo** usa soma 12 (Destreza 6 + Armas 6) também em **Centelha 0**: o
   despacho diz "soma principal 12 desde C1", sem dar o número de C0. Assumi 12 em toda a régua.
2. **Especialista** e **Defensivo** lutam com **espada longa** (o despacho só amarra arma às duas
   Típicas por nome). Força de ataque dos dois usa a mesma convenção do resto do arquivo
   (atributo de ataque = Destreza, como as fichas de soma).
3. O item **e** (Briga contra Armas) usa a mesma soma Destreza+Armas da Típica espada em cada
   Centelha para o lado desarmado (não há uma "Típica de Briga" nomeada no despacho).
4. O item **g** (erudito) roda sem armadura, Vigor 3; o despacho não especifica os dois.

## a. Duração entre iguais, por Centelha, ficha e armadura

${mdTabela(['arquétipo', 'C', 'armadura', 'ações p10/p50/p90', 'censura'], linhasA5)}

## b. Degrau automático X+1 contra X

${mdTabela(['arquétipo', 'armadura', 'confronto', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasB5)}

## c. Valor marginal das alavancas, nas fichas típicas (C1/C3/C5, gambeson)

${mdTabela(['arquétipo', 'C', 'alavanca', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasC5)}

## d. Espada contra montante (fichas típicas), por Tick

${mdTabela(['C', 'força/Tick (espada→montante)', '⚑', 'vitória espada, IC95%', 'viés', 'censura'], linhasD5)}

## e. Briga (soco novo) contra Armas (típica espada), sem armadura

${mdTabela(['C', 'força/Tick (Briga→Armas)', '⚑', 'vitória Briga, IC95%', 'viés', 'censura'], linhasE5)}

## f. Um contra grupo, com a típica espada

X é a Centelha do grupo (todos iguais); o único soma X+1 ou X+2.

${mdTabela(['confronto', 'X do grupo', 'vitória do único', 'censura'], linhasF5)}

## g. Conferência de sanidade

Erudito de Centelha 6 (Destreza 2, sem treino de combate) contra a Típica espada de Centelha 0.
Esperado: perde sem treino de Armas/Esquiva, resiste com Armas 2 e Esquiva 2.

${mdTabela(['ficha do erudito', 'vitória do erudito', 'dano erudito→típica', 'dano típica→erudito', 'censura', 'direção'], linhasG5)}

${direcaoOk ? '**Direção conferida: bate com o esperado.**' : '**ATENÇÃO: a direção NÃO bateu com o esperado. Ver console; isto é sinal de algo errado na Fase 1, não variação estatística.**'}

## Procedência

- \`node scripts/sim/calibrar.mjs --teste\`: golpes manuais e pontos de concordância entre a
  camada exata e \`resolverGolpe\`, agora os dois passando pela mesma fonte única do raspão
  (\`quaseAcertoDoEncontro\`, \`src/lib/lance.ts\`).
- \`node scripts/sim/calibrar.mjs --centelha --n ${N}\`: comando desta medição.
- Nenhuma regra nem catálogo foi alterado para produzir este relatório; só a bancada
  (\`scripts/sim/calibrar.mjs\`) ganhou as fichas de referência da Fase 5.

**Parada:** esta é a linha de base para revisão do simulador. As taxas de câmbio não devem ser
decididas antes da conferência da Revisora.
`;
  fs.writeFileSync(SAIDA, md5, 'utf8');
  console.log(`✓ relatório: ${path.relative(RAIZ, SAIDA)} (${N} lutas/célula)`);
}

if (CENTELHA_MODE) { testes(); rodarFase5(); process.exit(process.exitCode || 0); }

// A FATIA MÍNIMA que a seção 7 precisa (SOMAS × CS, espada longa/gambeson):
// roda SEMPRE, mesmo com B pulada, porque é barata (9 células) e o item 1/2/3
// não muda os números dela. Sem isto, pular B pularia a seção 7 também, e
// ninguém pediu isso.
const fielCache = new Map();
for (const soma of SOMAS) for (const c of CS) {
  const A = base(soma, c, 'espada-longa', 'gambeson');
  fielCache.set(chave({ soma, centelha: c, arma: 'espada-longa', armadura: 'gambeson' }), rodarEspelho({ A, B: A }, N));
}

// O RESUMO (soma 8, todas as Centelhas, gambeson + malha) é barato e SEMPRE
// fresco, mesmo com B pulada: 21 células, não as 126 da tabela B inteira.
const resumoDados = [];
for (const centelha of CENTELHAS) for (const arma of ARMAS) {
  const A = base(8, centelha, arma, 'gambeson');
  resumoDados.push({ centelha, arma, armadura: 'gambeson', fi: rodarEspelho({ A, B: A }, N) });
}
for (const centelha of CENTELHAS) {
  const A = base(8, centelha, 'espada-longa', 'malha');
  resumoDados.push({ centelha, arma: 'espada-longa', armadura: 'malha', fi: rodarEspelho({ A, B: A }, N) });
}
const linhasResumo = (() => {
  const duracao = (arma) => CENTELHAS.map((c) => {
    const fi = resumoDados.find((x) => x.centelha === c && x.arma === arma && x.armadura === 'gambeson').fi;
    return `C${c} ${fi.acoes.p50 ?? 'n/c'}${fi.censura ? ` (${pct(fi.censura)} cens.)` : ''}`;
  }).join('; ');
  const malhas = resumoDados.filter((x) => x.arma === 'espada-longa' && x.armadura === 'malha');
  const pior = Math.max(...malhas.map((x) => x.fi.censura));
  return [[duracao('espada-longa'), duracao('montante'), pct(pior)]];
})();

let secaoB;
if (PULAR.has('B')) {
  secaoB = secaoAnterior('## 3. B · Linha de base entre iguais');
  console.log('· B pulada (copiada do relatório anterior)');
} else {
  const linhasB = [];
  for (const soma of SOMAS) for (const centelha of CENTELHAS) for (const arma of ARMAS) for (const armadura of ARMADURAS) {
    const A = base(soma, centelha, arma, armadura);
    const fi = rodarEspelho({ A, B: A }, N);
    if (arma === 'espada-longa' && armadura === 'gambeson' && CS.includes(centelha)) {
      fielCache.set(chave({ soma, centelha, arma, armadura }), fi);
    }
    linhasB.push([
      soma, centelha, arma, armadura, pct(fi.acerto), pct(fi.raspao),
      qs(fi.acoes), pct(fi.censura), icPct(fi.ic), pp(fi.vies),
    ]);
  }
  secaoB = `## 3. B · Linha de base entre iguais\n\n${mdTabela(['soma', 'C', 'arma', 'armadura', 'acerto', 'raspão', 'ações p10/p50/p90', 'censura', 'vitória A, IC95%', 'viés'], linhasB)}`;
  console.log('· B concluído');
}

let secaoA;
if (PULAR.has('A')) {
  secaoA = secaoAnterior('## 2. A · Defesa perdida no golpe');
  console.log('· A pulada (copiada do relatório anterior)');
} else {
  const linhasA = [];
  for (const [nB, rotulo] of [[1, 'duelo'], [3, '1 contra 3']]) for (const soma of SOMAS) for (const c of CS) {
    const A = base(soma, c), B = base(soma, c);
    const fi = rodarFiel({ A, B, nB }, N);
    linhasA.push([rotulo, soma, c, num(fi.perdas.media), `${fi.perdas.p10}/${fi.perdas.p50}/${fi.perdas.p90}`, fi.perdas.n]);
  }
  secaoA = `## 2. A · Defesa perdida no golpe\n\nValores são módulos positivos da perda total P/G/R + Pressão observada na entrada real de\n\`resolverGolpe\`.\n\n${mdTabela(['formato', 'soma', 'C', 'média', 'p10/p50/p90', 'golpes'], linhasA)}`;
  console.log('· A concluído');
}

let secaoC;
if (PULAR.has('C')) {
  secaoC = secaoAnterior('## 4. C · Degrau automático de Centelha');
  console.log('· C pulada (copiada do relatório anterior)');
} else {
  const linhasC = [];
  for (const soma of SOMAS) for (let x = 0; x < 6; x++) for (const arma of ARMAS) for (const armadura of ARMADURAS) {
    const A = base(soma, x + 1, arma, armadura);
    const B = base(soma, x, arma, armadura);
    const fi = rodarEspelho({ A, B }, N);
    linhasC.push([
      soma, `${x + 1}×${x}`, arma, armadura,
      num(fi.dirA.dano), num(fi.dirB.dano), golpes(fi.dirA.golpes), golpes(fi.dirB.golpes),
      num(fi.forca, 3), ticks(fi.ticksA), num(fi.forcaTick, 3), fi.discorda ? '⚑' : '',
      icPct(fi.ic), pp(fi.vies), pct(fi.censura),
    ]);
  }
  secaoC = `## 4. C · Degrau automático de Centelha\n\nA é X+1; B é X. Dano e Ticks necessários são direcionais e vêm das mesmas lutas.\n\n${mdTabela(['soma', 'confronto', 'arma', 'armadura', 'dano A→B', 'dano B→A', 'golpes A→B', 'golpes B→A', 'força/tentativa', 'ticks A→B', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasC)}`;
  console.log('· C concluído');
}

const linhasD = [];
for (const soma of SOMAS) for (let x = 0; x < 6; x++) for (const cap of [null, 4, 6]) {
  const A = base(soma, x + 1), B = base(soma, x);
  const fi = rodarFiel({ A, B, nB: 3, pressaoCap: cap }, N);
  linhasD.push([soma, `${x + 1}×3 de ${x}`, cap == null ? 'sem teto' : `−${cap}`, fi.vitoriaA == null ? 'n/d' : pct(fi.vitoriaA), pct(fi.censura)]);
}
console.log('· D concluído');

const linhasE = [], eDados = [];
for (const soma of SOMAS) for (const c of CS) {
  const B = base(soma, c, 'espada-longa', 'gambeson');
  for (const al of ALAVANCAS) {
    const A = base(soma, c, 'espada-longa', 'gambeson', al);
    const fi = rodarEspelho({ A, B }, N);
    eDados.push({ soma, c, al, fi });
    linhasE.push([
      soma, c, al,
      num(fi.dirA.dano), num(fi.dirB.dano), golpes(fi.dirA.golpes), golpes(fi.dirB.golpes),
      num(fi.forca, 3), num(fi.forcaTick, 3), fi.discorda ? '⚑' : '',
      icPct(fi.ic), pp(fi.vies), pct(fi.censura),
    ]);
  }
}
console.log('· E concluído');

// ITEM 6C · +1 Força com montante (a par do +1 Destreza com espada, dentro de E)
const linhasMontante = [];
for (const soma of SOMAS) for (const c of CS) {
  const B = base(soma, c, 'montante', 'gambeson');
  const A = base(soma, c, 'montante', 'gambeson', 'atributo+1-forca-montante');
  const fi = rodarEspelho({ A, B }, N);
  linhasMontante.push([
    soma, c, num(fi.dirA.dano), num(fi.dirB.dano), golpes(fi.dirA.golpes), golpes(fi.dirB.golpes),
    num(fi.forca, 3), num(fi.forcaTick, 3), fi.discorda ? '⚑' : '', icPct(fi.ic), pp(fi.vies), pct(fi.censura),
  ]);
}
console.log('· montante (+1 Força) concluído');

// ITEM 6C · Briga (desarmado) contra Armas (espada longa, sem armadura dos dois lados)
let secaoBriga;
if (PULAR.has('Briga')) {
  secaoBriga = secaoAnterior('### 6b. Alavanca nova: Briga (desarmado) contra Armas');
  console.log('· Briga × Armas pulada (copiada do relatório anterior)');
} else {
  const linhasBriga = [];
  for (const soma of SOMAS) for (const c of CS) {
    const armas = base(soma, c, 'espada-longa', 'nenhuma');
    const briga = perfilBrigaDe({ soma, centelha: c });
    const fi = rodarEspelho({ A: briga, B: armas }, N);
    linhasBriga.push([
      soma, c, num(fi.dirA.dano), num(fi.dirB.dano), golpes(fi.dirA.golpes), golpes(fi.dirB.golpes),
      num(fi.forca, 3), num(fi.forcaTick, 3), fi.discorda ? '⚑' : '', icPct(fi.ic), pp(fi.vies), pct(fi.censura),
    ]);
  }
  secaoBriga = `### 6b. Alavanca nova: Briga (desarmado) contra Armas\n\nA é Briga (desarmado, \`skills2.briga\`); B é Armas (espada longa). Os dois sem armadura, mesma\nsoma e mesma Centelha.\n\n${mdTabela(['soma', 'C', 'dano A→B', 'dano B→A', 'golpes A→B', 'golpes B→A', 'força/tentativa', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasBriga)}`;
  console.log('· Briga × Armas concluído');
}

// ITEM 6C · Arremesso contra Atirador: NÃO RODADO.
//
// O motor (`scripts/sim/motor.mjs`/`cena.mjs`) não modela alcance nem posição
// além da distância inicial fixa de `cenaDe` (peças sempre nascem adjacentes).
// A penalidade por faixa de distância é só EXIBIDA na mesa (`faixaNaFolha`,
// `grid.astro`, comentário "MOSTRA E NÃO APLICA": quem soma é o mestre, à
// mão), e nenhuma das duas réguas (`decisaoAutomatica`, `resolverGolpe`)
// aplica alcance de verdade. Rodar Arremesso × Atirador na cena adjacente de
// hoje não exercitaria a identidade tática de nenhum dos dois (que é operar a
// distância) e mediria só o mesmo duelo corpo a corpo com nomes diferentes de
// arma: uma medição que mentiria por omissão. Parado aqui, como o despacho
// pediu; ver H7 em `docs/pendencias/H-arremesso.md` para o modelo de distância
// que falta.

const linhasMonotonia = (() => {
  const xs = eDados.filter((x) => x.al === 'ataque+1');
  const ruins = xs.filter((x) => !(x.fi.forcaTick > 1));
  return [[ruins.length ? 'não' : 'sim', `${xs.length - ruins.length}/${xs.length}`, ruins.length ? ruins.map((x) => `S${x.soma} C${x.c}`).join(', ') : 'nenhuma']];
})();

const md = `# 15 · Linha de base do combate no motor real

27/09/2026 · **RASCUNHO DE MEDIÇÃO**, regenerado com a Regra do Quase-Acerto (item 2) e o
conserto do Simultâneo (item 3) já na regra viva. Nada deste relatório vale para preço antes da
conferência da Revisora. ${N} lutas em cada orientação de cada célula, semente mestre ${SEMENTE}.

## Resumo para a Revisora

Os cenários locais V1/V2/V3 da rodada anterior saíram: a regra viva agora é a que estava em V1
(o acerto nunca dói menos que o raspão do mesmo golpe), incondicional em \`resolverGolpe\`
(\`src/lib/lance.ts\`), e a Redução da armadura leve também desconta o raspão (a Centelha do
alvo entra na conta, item 2a). Não existe mais variante de Absorção por tipo de dano: a Centelha
soma na Absorção normal dos três tipos, como sempre fez.

“Imunidade” nesta página significa uma luta que não terminou em 1.000 Ticks, não invulnerabilidade
matemática. A duração usa a ficha intermediária, soma 8 e gambeson; cada célula contém ${2 * N}
lutas, metade em cada orientação.

${mdTabela(['mediana espada por C', 'mediana montante por C', 'pior espada×malha'], linhasResumo)}

O teste de monotonicidade abaixo usa a força por Tick (item 6b). “Sim” exige que +1 Ataque reduza
os Ticks necessários de A em todas as nove células de soma 6/8/12 e Centelha 1/3/5.

${mdTabela(['+1 Ataque sempre positivo?', 'células positivas', 'falhas'], linhasMonotonia)}

**Viés de lado (item 6d, depois do conserto do item 3):** a coluna "viés" de cada tabela abaixo é
a chance de A vencer no lado \`a\` menos a chance de vencer no lado \`b\`. O conserto do item 3
(quem estava de pé solta todos os golpes do Tick em que caiu) tira uma fonte de assimetria entre
as duas orientações do mesmo duelo espelhado; o esperado é que o viés observado agora seja menor
que numa medição equivalente antes do conserto. Este relatório não guarda a medição ANTES (a
rodada anterior media outra coisa, os cenários V1/V2/V3), então a comparação fica para quem tiver
os dois números lado a lado.

## 1. Método e limites

Fichas sem Proezas: soma 6/8/12 dividida igualmente entre Atributo e Habilidade; Vigor 3; mesma
ficha em C0–C6. A espada longa ocupa uma mão, com adaga inativa na outra apenas para acionar a
fórmula viva de uma mão; Montante usa duas. Armadura nenhuma/Gambeson/Malha. Todos começam
adjacentes; a luta vai até um lado cair, sem fuga ou desistência automáticas. Empate de iniciativa
varia pela semente.

Camada exata: Defesa cheia e golpes independentes, mas preserva pool, paridade, Acerto da arma,
Margens, Quase-Acerto, dano e Absorção. Ela não modela P/G/R, Pressão, ferimentos, iniciativa ou
simultaneidade, e roda com a Centelha do alvo zerada (não carrega um segundo lado na conta
manual). Camada fiel: todas essas regras operam, com a Centelha de verdade dos dois lados.
“Ações até cair” mede duração e aparece apenas como duração, nunca como força.

Cada duelo roda duas bancadas: A no lado \`a\` e A no lado \`b\`. A chance publicada reúne as duas
orientações e traz intervalo de confiança de Wilson de 95%. O viés é a chance de A vencer no lado
\`a\` menos a chance de vencer no lado \`b\`. Lutas censuradas ficam fora da chance, mas sua fração
é publicada.

**A força por Tick (item 6b, a métrica principal agora)** usa todos os golpes das mesmas lutas
espelhadas, do mesmo jeito que a força por tentativa (mantida ao lado, marcada com ⚑ quando as
duas discordam muito): para cada direção, dano médio por tentativa dividido pelas tentativas
daquela direção dá o dano médio; PV iniciais do alvo dividido por esse dano médio dá as
TENTATIVAS necessárias; essa contagem multiplicada pelo CICLO do atacante (Preparo + Golpe +
Recuperação de um ataque simples, em Ticks, por \`combate-tempo.ts\`'s \`anatomia\`) dá os TICKS
necessários. Força relativa por Tick = Ticks que B precisa para derrubar A dividido pelos Ticks
que A precisa para derrubar B. Valor 1 é igualdade; acima de 1 favorece A. A força por tentativa
(a métrica antiga) é a mesma conta sem o ciclo, e as duas discordam sobretudo quando as armas têm
ciclos diferentes (a pesada bate mais forte por golpe, mas gasta mais Ticks por golpe): a coluna
⚑ marca essa discordância.

Os documentos de referência usados estão em \`docs/calibracao/09-inventario-calculos.md\` e
\`14-levantamento-pesos.md\`.

${secaoA}
${secaoB}
${secaoC}


## 5. D · Um contra três e Pressão

Equipamento de referência: espada longa e gambeson.

${mdTabela(['soma', 'confronto', 'Pressão', 'vitória do único', 'censura'], linhasD)}

## 6. E · Valor marginal das alavancas

Centelha 1/3/5; espada longa e gambeson. A é a peça modificada; B é a ficha igual sem
modificação. \`habilidade+1\` altera Armas. Ticks alteram somente a anatomia da peça modificada.

${mdTabela(['soma', 'C', 'alavanca', 'dano A→B', 'dano B→A', 'golpes A→B', 'golpes B→A', 'força/tentativa', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasE)}

### 6a. Alavanca nova: +1 Força com Montante

Par do \`atributo+1-destreza-espada\` de cima (que já mede +1 Destreza com espada longa dentro da
tabela E), agora com Montante e +1 Força.

${mdTabela(['soma', 'C', 'dano A→B', 'dano B→A', 'golpes A→B', 'golpes B→A', 'força/tentativa', 'força/Tick', '⚑', 'vitória A, IC95%', 'viés', 'censura'], linhasMontante)}

${secaoBriga}
### 6c. Arremesso contra Atirador: NÃO RODADO

O motor não modela alcance nem posição além da distância inicial fixa da bancada (peças sempre
nascem adjacentes); a penalidade por faixa de distância é só exibida na mesa, e o mestre soma à
mão. Rodar esta alavanca na cena adjacente de hoje mediria o mesmo duelo corpo a corpo com nomes
diferentes de arma. Parado aqui, como o despacho autorizou.

## 7. Onde as camadas divergem

${mdTabela(['soma', 'C', 'dano ex. DV0', 'dano ex. DV4', 'dano fiel', 'ações p50 ex0/ex4/fiel', 'censura'], (() => {
  const out = [];
  for (const soma of SOMAS) for (const c of CS) {
    const A = base(soma, c), ex0 = acoesExatas(A, A, 0), ex4 = acoesExatas(A, A, 4);
    const fi = fielCache.get(chave({ soma, centelha: c, arma: 'espada-longa', armadura: 'gambeson' }));
    out.push([soma, c, num(ex0.dano), num(ex4.dano), num(fi.dirA.dano), `${ex0.p50 ?? '>200'}/${ex4.p50 ?? '>200'}/${fi.acoes.p50 ?? 'cens.'}`, pct(fi.censura)]);
  }
  return out;
})())}

A camada exata com Defesa cheia subestima acerto e dano sempre que a perda real é negativa. Usar
perda fixa 4 aproxima alguns pontos, mas apaga a distribuição, a escalada de Pressão, o momento do
ciclo e o ferimento. “Censura” é a fração que não chegou a uma queda em 1.000 Ticks; essas lutas
não entram nos percentis nem são contadas como derrota. A camada rápida serve para varrer direção
e ordenar alavancas; níveis finais precisam dos pontos fiéis.

### Leitura para a revisão do simulador

- A perda de Defesa não é uma constante 4: no duelo sua mediana foi 2; no 1 contra 3, 4, com p90 8.
  A aproximação fixa depende do formato do encontro.
- Há células em que a espada longa não atravessa a combinação de Absorção e Quase-Acerto o
  bastante para encerrar a luta. A censura é resultado, não zero nem derrota.
- Aumentar Ataque ou Habilidade pode reduzir a chance de vitória em certas células: um raspão
  causa dano fixo ignorando Absorção, enquanto um acerto fraco sofre Absorção e pode causar zero
  (embora agora nunca menos que o próprio raspão, item 2c). O simulador preserva essa
  descontinuidade da regra viva; a Revisora deve confirmar que ela é intencional antes de usar a
  alavanca de ataque como moeda monotônica.
- +1d6 de dano foi muito mais forte que +1 fixo nas células de referência. A razão varia com
  Absorção, portanto não existe conversão universal entre dado e ponto.
- A força por Tick (item 6b) é a moeda nova: compare-a com a força por tentativa antes de decidir
  preço de Proeza que muda o CICLO da arma (Proezas de velocidade), porque só a força por
  tentativa fica cega para esse efeito.

## 8. Procedência e conferência

- \`node scripts/sim/calibrar.mjs --teste\`: três golpes determinísticos conferidos contra
  \`resolverGolpe\` (erro, raspão, acerto com Margem e o piso do item 2c) e dois pontos de
  distribuição em que a camada rápida e o resolvedor usado pela camada fiel concordam exatamente,
  por enumeração direta através de \`lance.ts\`.
- \`node scripts/sim/calibrar.mjs --n ${N}\`: comando desta medição; cada célula de duelo executa
  ${N} lutas por orientação.
- Pressão sem teto é a regra viva; −4 e −6 são somente variantes locais.
- Nenhum valor de Proeza foi aplicado e nenhum catálogo foi modificado.

**Parada:** esta é a linha de base para revisão do simulador. As taxas de câmbio não devem ser
decididas antes da conferência da Revisora.
`;
fs.writeFileSync(SAIDA, md, 'utf8');
testes();
console.log(`✓ relatório: ${path.relative(RAIZ, SAIDA)} (${N} lutas/célula)`);
