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
const SAIDA = path.resolve(RAIZ, arg('--saida', 'docs/calibracao/15-linha-de-base.md'));
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
      const piso = Math.max(0, A.qa.armaDano - B.qa.armaduraReducao);
      for (let d = 0; d < distD.length; d++) {
        const normal = Math.max(0, d + da.flat - (B.soak[A.tipoDano] || 0));
        const liq = Math.max(normal, piso);
        dano.set(liq, (dano.get(liq) || 0) + ca * Number(distD[d]) / denM);
      }
    } else if (defesa - total + 1 <= A.qa.armaBonus + B.qa.armaduraBonus) {
      raspao += ca;
      const liq = Math.max(0, A.qa.armaDano - B.qa.armaduraReducao);
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
  const casos = [
    { nome: 'erro', a: 10, d: 5, defesaPerdida: 0, esperado: ['erro', 0] },
    { nome: 'raspão', a: B.defesa - A.qa.armaBonus - B.qa.armaduraBonus + 1, d: 5, defesaPerdida: 0,
      esperado: ['raspao', Math.max(0, A.qa.armaDano - B.qa.armaduraReducao - B.centelha)] },
    { nome: 'acerto', a: B.defesa + 7, d: 9, defesaPerdida: 0,
      esperado: ['acerto', Math.max(Math.max(0, 9 - B.soak.corte), Math.max(0, A.qa.armaDano - B.qa.armaduraReducao - B.centelha))] },
  ];
  for (const c of casos) {
    const entrada = {
      atacante: { ataque: A.ataque, dano: A.dano, ajusteDados: 0, ajusteFlat: 0, penDados: [0], qaArmaBonus: A.qa.armaBonus, qaArmaDano: A.qa.armaDano },
      alvo: { defesaBase: B.defesa, ferimento: 0, condicoesDefesa: 0, defesaPerdida: c.defesaPerdida, soak: B.soak.corte, pv: B.pvMax, pvMax: B.pvMax, qaArmaduraBonus: B.qa.armaduraBonus, qaArmaduraReducao: B.qa.armaduraReducao, centelha: B.centelha },
      golpeIndice: 0, margemQA: A.qa.armaBonus + B.qa.armaduraBonus,
      danoQA: Math.max(0, A.qa.armaDano - B.qa.armaduraReducao - B.centelha), tipoDano: 'corte', modManual: 0,
    };
    const out = L0.resolverGolpe(entrada, { rolar: (() => { const q = [{ total: c.a, rolls: [] }, { total: c.d, rolls: [] }]; let i = 0; return () => q[i++]; })() });
    assert(out.veredito === c.esperado[0], `${c.nome}: veredito ${out.veredito}`);
    assert(out.danoLiquido === c.esperado[1], `${c.nome}: dano ${out.danoLiquido}`);
  }
  // A camada exata e resolverGolpe concordam em dois pontos de probabilidade,
  // pois ambos usam a mesma desigualdade, Margem, QA e Absorção (com Centelha
  // zero, para o exato não precisar carregar o desconto de alvo).
  for (const [s, c] of [[6, 1], [12, 5]]) {
    const X = base(s, c), ex = golpeExato(X, X, 0);
    let hit = 0, qa = 0, dano = 0; const distA = d6Dist(parseExpr(X.ataque).dados), denA = 6 ** parseExpr(X.ataque).dados;
    const at = parseExpr(X.ataque), da = parseExpr(X.dano), distD = d6Dist(da.dados), denD = 6 ** da.dados;
    for (let a = 0; a < distA.length; a++) for (let d = 0; d < distD.length; d++) {
      const w = Number(distA[a]) * Number(distD[d]) / denA / denD;
      const entrada = { atacante: { ataque: X.ataque, dano: X.dano, ajusteDados: 0, ajusteFlat: 0, penDados: [0], qaArmaBonus: X.qa.armaBonus, qaArmaDano: X.qa.armaDano }, alvo: { defesaBase: X.defesa, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0, soak: X.soak.corte, pv: X.pvMax, pvMax: X.pvMax, qaArmaduraBonus: X.qa.armaduraBonus, qaArmaduraReducao: X.qa.armaduraReducao, centelha: 0 }, golpeIndice: 0, margemQA: X.qa.armaBonus + X.qa.armaduraBonus, danoQA: Math.max(0, X.qa.armaDano - X.qa.armaduraReducao), tipoDano: 'corte', modManual: 0 };
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
