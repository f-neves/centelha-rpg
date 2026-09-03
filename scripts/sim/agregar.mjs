// agregar.mjs · dos `.jsonl` para as tabelas do relatório.
//
// A ordem das tabelas é a régua do D8b (`04-prontidao.md` §D8b): as métricas
// POR ETAPA são as que reprovam uma regra, as POR BATALHA são contexto, e a
// duração não é critério, é multiplicador. Uma regra que dobre a duração e
// mantenha a carga por Tick é neutra; uma que encurte a batalha e dobre os
// cliques por etapa é ruim.
//
// E TODA TABELA DIZ DE QUE FASE E DE QUE FATIA ELA VEIO. Duas vezes seguidas um
// número desta frente saiu errado por juntar dois jogos numa média só: primeiro
// o impasse com a batalha que termina, depois a fuga com o combate. O cabeçalho
// de cada tabela é o conserto.
//
//   node scripts/sim/agregar.mjs --saida .sim/2026-09-03
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './lib-ponte.mjs';

const arg = (n, p) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : p; };
const DIR = path.resolve(RAIZ, arg('--saida', '.sim/ultima'));

const linhas = [];
for (const f of fs.readdirSync(DIR)) {
  if (!/^faixa-\d+\.jsonl$/.test(f)) continue;
  for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
    if (l.trim()) linhas.push(JSON.parse(l));
  }
}
const manifesto = JSON.parse(fs.readFileSync(path.join(DIR, 'bateria.json'), 'utf8'));
const perdidas = fs.existsSync(path.join(DIR, 'perdidas.json'))
  ? JSON.parse(fs.readFileSync(path.join(DIR, 'perdidas.json'), 'utf8')) : [];

// A BATALHA INVÁLIDA VAI PARA O BALDE PRÓPRIO e não entra em média nenhuma:
// uma batalha que viola invariante na média é pior que uma batalha a menos.
const invalidas = linhas.filter((l) => l.invariantes?.length);
const boas = linhas.filter((l) => !l.invariantes?.length);

const med = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const varia = (a) => {
  if (a.length < 2) return 0;
  const m = med(a);
  return a.reduce((x, y) => x + (y - m) ** 2, 0) / (a.length - 1);
};
const num = (x, c = 2) => (x == null ? '·' : x.toFixed(c));
const pct = (x) => (x == null ? '·' : `${(x * 100).toFixed(0)}%`);

/** As células, na ordem do plano, e as fatias por nível de limiar. */
const porCelula = new Map();
for (const l of boas) {
  if (!porCelula.has(l.celula)) porCelula.set(l.celula, []);
  porCelula.get(l.celula).push(l);
}
const CEL = manifesto.celulas || [];
const infoDe = (id) => CEL.find((c) => c.id === id) || {};
const daFatia = (nivel, mapa = MAPA_PRINC) => [...porCelula.entries()]
  .filter(([id]) => infoDe(id).nivelLimiar === nivel
    && (!mapa || infoDe(id).nivelMapa === mapa));
const MAPAS = [...new Set(CEL.map((c) => c.nivelMapa))].filter(Boolean);
const MAPA_PRINC = MAPAS.includes('apertado') ? 'apertado' : MAPAS[0];
const NIVEIS = [...new Set(CEL.map((c) => c.nivelLimiar))].filter(Boolean);
const PRINCIPAL = NIVEIS.includes('l25') ? 'l25' : NIVEIS[0];

const alarmes = [];
const alarme = (t) => alarmes.push(t);

// ==================================================================== escopo
console.log(`\n· bateria ${manifesto.run_id} (${manifesto.tipo || 'grande'})`
  + ` · commit ${String(manifesto.commit).slice(0, 7)}${manifesto.sujo ? ' ⚠ÁRVORE SUJA' : ''}`
  + ` · dados ${manifesto.dados_hash}`);
console.log(`  ${linhas.length} batalhas em ${porCelula.size} células`
  + ` · ${invalidas.length} inválidas (fora de toda média)`);
console.log('\n  O QUE ESTA BATERIA MEDE, e é o que ela NÃO mede que decide o alcance:');
console.log('  · a política é a `decisaoAutomatica` do produto. Ela ataca o mais perto e foge');
console.log('    com a Vida baixa, e não faz mais nada. Toda leitura é sobre ESSE robô;');
console.log('  · a manobra é sempre `simples`. NENHUMA batalha exercita rajada nem empunhadura');
console.log('    dupla, então o conserto do L11 (a penalidade por golpe) não é testado aqui.');

if (perdidas.length) {
  alarme(`${perdidas.length} faixa(s) de processo perdida(s): a leitura está INCOMPLETA`);
}
if (invalidas.length) {
  const porq = {};
  for (const l of invalidas) for (const f of l.invariantes) porq[f.slice(0, 46)] = (porq[f.slice(0, 46)] || 0) + 1;
  for (const [k, v] of Object.entries(porq)) console.log(`    ✗ ${v}× ${k}`);
  alarme(`${invalidas.length} batalha(s) violaram invariante`);
}

// ------------------------------------------------------------ as duas fases
/** Lê um bloco de contadores: o total ou uma das fases. */
const F = (l, fase) => (fase === 'total' ? l : l.fases[fase]);
const medFase = (ls, fase, f) => med(ls.map((l) => f(F(l, fase))).filter((x) => x != null));

/**
 * A fração de iii de uma fatia, em banda.
 *
 * As duvidosas são `agenda` e `reprojetar`: a mesa oferece escolha nos dois (a
 * manobra, o modo de deslocamento, os metros por Tick e o P/G/R na primeira; a
 * reordenação à mão e o abortar na segunda). O critério é "um humano pode
 * responder diferente do motor", e não "rola dado".
 */
const DUVIDOSAS = ['agenda', 'reprojetar'];
const fatiaIII = (ls, fase) => {
  const sm = (f) => ls.reduce((x, l) => x + f(F(l, fase)), 0);
  const i = sm((x) => x.paradas.i), ii = sm((x) => x.paradas.ii), iii = sm((x) => x.paradas.iii);
  const dv = sm((x) => DUVIDOSAS.reduce((y, k) => y + (x.paradasSub?.[k] || 0), 0));
  const t = i + ii + iii;
  return { n: ls.length, t, pct: t ? iii / t : null, piso: t ? (iii - dv) / t : null };
};

const rotulo = (id) => id.replace(/-(apertado|aberto)-l\d+$/, '');
/** Para os ALARMES, que precisam dizer QUAL tabuleiro: o nível de mapa fica. */
const rotuloCheio = (id) => id.replace(/-l\d+$/, '');
const LIMIAR_PRINC = CEL.find((c) => c.nivelLimiar === PRINCIPAL)?.limiar;

// ================================================== A · a carga, por célula
for (const fase of ['combate', 'fuga']) {
  console.log(`\n── A · A CARGA por célula · FASE DE ${fase.toUpperCase()}`
    + ` · limiar ${LIMIAR_PRINC}% · todas as batalhas ──`);
  console.log('célula'.padEnd(26) + 'Ticks  par/Tick    p90  pico  gestos  s/parada  s/golpe');
  for (const [id, ls] of daFatia(PRINCIPAL)) {
    const t = medFase(ls, fase, (x) => x.ticks);
    if (!t) { console.log(rotulo(id).padEnd(26) + '     ·   (a fase não aconteceu nesta célula)'); continue; }
    const pt = medFase(ls, fase, (x) => x.paradasPorTick.media);
    const p90 = medFase(ls, fase, (x) => x.paradasPorTick.p90);
    const pico = Math.max(...ls.map((l) => F(l, fase).paradasPorTick.pico));
    const g = medFase(ls, fase, (x) => x.gestos);
    const sp = medFase(ls, fase, (x) => x.fracaoSemParada);
    const sg = medFase(ls, fase, (x) => x.fracaoSemGolpe);
    console.log(rotulo(id).padEnd(26) + num(t, 1).padStart(6) + num(pt).padStart(9)
      + num(p90).padStart(7) + String(pico).padStart(6) + num(g, 0).padStart(8)
      + num(sp).padStart(10) + num(sg).padStart(9));
  }
}

// ============================== o quadro dos quatro estados, na fase de combate
console.log('\n── O QUADRO DOS QUATRO ESTADOS DE UM TICK · FASE DE COMBATE · todas as batalhas ──');
console.log('célula'.padEnd(26) + '   nada  só res.  só parou  ambos    soma');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const q = (k) => med(ls.map((l) => (l.fases.combate.quadro[k] || 0) / Math.max(1, l.fases.combate.ticks)));
  const soma = q('nada') + q('soResolveu') + q('soParou') + q('ambos');
  console.log(rotulo(id).padEnd(26) + num(q('nada')).padStart(7) + num(q('soResolveu')).padStart(9)
    + num(q('soParou')).padStart(10) + num(q('ambos')).padStart(7)
    + num(soma).padStart(8) + (Math.abs(soma - 1) < 0.005 ? ' ✓' : ' ✗ NÃO FECHA'));
}

// ================================ de onde vêm as paradas, e o que a automação esvazia
//
// A TABELA QUE EXPLICA TODAS AS OUTRAS. A composição por classe diz QUANTO é
// aritmética; esta diz QUAL aritmética, e é onde a re-projeção aparece pelo
// tamanho que tem.
console.log('\n── DE ONDE VÊM AS PARADAS · FASE DE COMBATE · média por batalha ──');
console.log('célula'.padEnd(26) + 'declarar   agenda  reprojetar  resolver  aplicar    fugir');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const s2 = (k) => medFase(ls, 'combate', (x) => x.paradasSub?.[k] || 0);
  console.log(rotulo(id).padEnd(26) + num(s2('declarar'), 1).padStart(8)
    + num(s2('agenda'), 1).padStart(9) + num(s2('reprojetar'), 1).padStart(12)
    + num(s2('resolver'), 1).padStart(10) + num(s2('aplicar'), 1).padStart(9)
    + num(s2('fugir'), 1).padStart(9));
}

// ------------------------------------- o que a automação esvazia, MEDIDO
//
// Um Tick cujas paradas são TODAS de classe iii deixa de consultar alguém
// quando o motor resolver a classe iii. Somado aos Ticks que já não consultam
// ninguém, é o teto de CLIQUES que a automação tira, e sai do log e não da
// tabela. Ele é diferente do que a automação tira em PARADAS, e confundir os
// dois foi o erro da leitura de 02/09.
console.log('\n── O QUE A AUTOMAÇÃO ESVAZIA EM CLIQUES · FASE DE COMBATE ──');
console.log('célula'.padEnd(26) + 's/parada hoje   +só iii   = depois   (piso)');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const hoje = medFase(ls, 'combate', (x) => x.fracaoSemParada);
  const so = medFase(ls, 'combate', (x) => (x.ticksSoIII || 0) / Math.max(1, x.ticks));
  const soP = medFase(ls, 'combate', (x) => (x.ticksSoIIIPiso || 0) / Math.max(1, x.ticks));
  console.log(rotulo(id).padEnd(26) + num(hoje).padStart(12) + num(so).padStart(10)
    + num(hoje + so).padStart(11) + num(hoje + soP).padStart(9));
}
console.log('  `só iii` é o Tick em que TODA parada é aritmética: ele some inteiro.');
console.log('  O piso conta só `resolver` como aritmética forçada.');

// ================================================== B · a composição, em banda
console.log('\n── B · A COMPOSIÇÃO POR CLASSE, em banda · AS DUAS FASES, lado a lado ──');
console.log('  banda: teto com `agenda`+`reprojetar`+`resolver` como iii; piso só com `resolver`.');
console.log('célula'.padEnd(26) + 'combate: piso–teto      fuga: piso–teto      Δ teto');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const c = fatiaIII(ls, 'combate');
  const f = fatiaIII(ls, 'fuga');
  const d = (c.pct != null && f.pct != null) ? f.pct - c.pct : null;
  console.log(rotulo(id).padEnd(26)
    + `${pct(c.piso)}–${pct(c.pct)}`.padEnd(24)
    + (f.t ? `${pct(f.piso)}–${pct(f.pct)}` : '(não houve)').padEnd(21)
    + (d == null ? '·' : (d > 0 ? '+' : '') + pct(d)));
}

// ------------------------------------------- o número do topo do relatório
const term = boas.filter((l) => l.fim !== 'estourou');
const impasse = boas.filter((l) => l.fim === 'estourou');
const doPrincipal = term.filter((l) => infoDe(l.celula).nivelLimiar === PRINCIPAL);
const doTopo = fatiaIII(doPrincipal, 'combate');
const daFugaT = fatiaIII(doPrincipal, 'fuga');
console.log('\n  O NÚMERO DO TOPO, e ele é o da FASE DE COMBATE das batalhas que TERMINAM:');
console.log(`    combate (${doTopo.n} batalhas): ${pct(doTopo.piso)} a ${pct(doTopo.pct)} de classe iii   ← É ESTE`);
console.log(`    fuga    (as mesmas):          ${pct(daFugaT.piso)} a ${pct(daFugaT.pct)}   ← leitura própria, fora da média`);
console.log(`    impasse (${impasse.length} batalhas que estouram): fora de toda leitura`);

// =================================== a sensibilidade ao limiar de fuga (§3)
if (NIVEIS.length > 1) {
  console.log('\n── A SENSIBILIDADE AO LIMIAR DE FUGA · o mesmo robô, dois valores do produto ──');
  console.log('  Não é política nova: é o `fugirAbaixoDePct` do `regras.json`, em dois níveis.');
  console.log('  (só as batalhas que TERMINAM)');
  console.log('nível'.padEnd(12) + 'batalhas   %iii combate    %iii fuga   Tick da fuga  fuga-consumada');
  const leitura = {};
  for (const nv of NIVEIS) {
    const ls = term.filter((l) => infoDe(l.celula).nivelLimiar === nv);
    const c = fatiaIII(ls, 'combate'), f = fatiaIII(ls, 'fuga');
    const tf = med(ls.map((l) => l.tickDaFuga).filter((x) => x != null));
    const fc = ls.filter((l) => l.fim === 'fuga-consumada').length / Math.max(1, ls.length);
    leitura[nv] = c.pct;
    const lim = CEL.find((x) => x.nivelLimiar === nv)?.limiar;
    console.log(`${nv} (${lim}%)`.padEnd(12) + String(ls.length).padStart(8)
      + `${pct(c.piso)}–${pct(c.pct)}`.padStart(15)
      + (f.t ? `${pct(f.piso)}–${pct(f.pct)}` : '(não houve)').padStart(13)
      + num(tf, 1).padStart(15) + pct(fc).padStart(16));
  }
  const vs = Object.values(leitura).filter((x) => x != null);
  const dif = vs.length > 1 ? Math.max(...vs) - Math.min(...vs) : 0;
  console.log(dif > 0.05
    ? `\n  ⚠ A LEITURA MUDA COM O LIMIAR (${(dif * 100).toFixed(0)} pontos): a conclusão da bateria`
      + '\n    depende dele, e isso vai no topo do relatório.'
    : `\n  ✓ A leitura NÃO muda com o limiar (${(dif * 100).toFixed(0)} pontos): a conclusão é robusta a ele.`);
}

// =================================== E4 · a assimetria de passo, contra a âncora
const comE4 = CEL.filter((c) => c.passoMult > 1 && c.nivelLimiar === PRINCIPAL);
if (comE4.length) {
  console.log('\n── E4 · A ASSIMETRIA DE PASSO, contra a âncora (3×3, distância média) ──');
  console.log(`  ⚑ o multiplicador (${manifesto.eixos?.passoAssimetrico}×) é posto pelo ajuste por instância do passo.`);
  console.log('par'.padEnd(26) + 'Ticks  par/Tick  re-projeções  s/golpe   fim dominante');
  for (const c of comE4) {
    for (const [nome, id] of [['âncora', `${c.ciclo}-media-3x3-${c.nivelLimiar}`], ['passo 2×', c.id]]) {
      const ls = porCelula.get(id) || [];
      if (!ls.length) { console.log(`${c.ciclo} · ${nome}`.padEnd(26) + '  (sem batalhas)'); continue; }
      const t = med(ls.map((l) => l.ticks));
      const pt = medFase(ls, 'combate', (x) => x.paradasPorTick.media);
      const rp = med(ls.map((l) => l.paradasSub?.reprojetar || 0));
      const sg = medFase(ls, 'combate', (x) => x.fracaoSemGolpe);
      const fins = {};
      for (const l of ls) fins[l.fim] = (fins[l.fim] || 0) + 1;
      const dom = Object.entries(fins).sort((a, b) => b[1] - a[1])[0];
      console.log(`${c.ciclo} · ${nome}`.padEnd(26) + num(t, 1).padStart(6) + num(pt).padStart(9)
        + num(rp, 1).padStart(14) + num(sg).padStart(9)
        + `   ${dom[0]} (${((dom[1] / ls.length) * 100).toFixed(0)}%)`);
    }
  }
}

// ===================================== E12 · o tabuleiro, corredor contra campo
//
// O EIXO QUE EXISTE PARA MATAR UMA DÚVIDA SOBRE OS OUTROS. O mapa era `dist + 8`
// por `n + 2`, e isso é um corredor: com dezesseis peças em dez linhas, quem
// persegue esbarra na aglomeração e re-projeta todo Tick, e com nove colunas de
// largura quem foge sai em UM Tick. Os dois números mais fortes da bateria
// podiam ser da largura do mapa e não do Grid.
if (MAPAS.length > 1) {
  console.log('\n── E12 · O TABULEIRO · corredor contra campo aberto ──');
  console.log(`  apertado: dist+8 × max(4, n+2) · aberto: dist+40 × max(12, 2n+4), peças centradas.`);
  console.log('  (fase de combate, limiar de produção)');
  console.log('célula'.padEnd(26) + 'par/Tick        re-projeções       %iii teto      fuga-consumada');
  console.log(''.padEnd(26) + 'apert.  abert.   apert.   abert.   apert. abert.   apert. abert.');
  for (const [id, ls] of daFatia(PRINCIPAL, MAPA_PRINC)) {
    const outro = porCelula.get(id.replace('-apertado-', '-aberto-'));
    if (!outro) continue;
    const pt = (x) => num(medFase(x, 'combate', (y) => y.paradasPorTick.media));
    const rp = (x) => num(medFase(x, 'combate', (y) => y.paradasSub?.reprojetar || 0), 1);
    const p3 = (x) => pct(fatiaIII(x, 'combate').pct);
    const fc = (x) => pct(x.filter((l) => l.fim === 'fuga-consumada').length / x.length);
    console.log(rotulo(id).padEnd(26)
      + pt(ls).padStart(6) + pt(outro).padStart(8)
      + rp(ls).padStart(9) + rp(outro).padStart(9)
      + p3(ls).padStart(9) + p3(outro).padStart(7)
      + fc(ls).padStart(9) + fc(outro).padStart(7));
  }
}

// ============================ a conta da cadência, antes de suspeitar do laço
//
// A COLUNA É O TICK SEM GOLPE, e não o sem resolução: chegar ao alcance e cair
// no chão também resolvem alguma coisa, e comparar uma coluna que os inclui com
// uma conta que é só sobre golpes dava SOBRA NEGATIVA, que é impossível pelo
// raciocínio que justifica a conta.
console.log('\n── A CONTA DO TICK SEM GOLPE · FASE DE COMBATE · todas as batalhas ──');
console.log('célula'.padEnd(26) + '  s/golpe  cadência  sobra');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const sg = medFase(ls, 'combate', (x) => x.fracaoSemGolpe);
  const g = medFase(ls, 'combate', (x) => x.golpesAplicados);
  const t = medFase(ls, 'combate', (x) => x.ticks);
  const prev = Math.max(0, 1 - (g / Math.max(1, t)));
  // O zero negativo é ruído de arredondamento e lê-se como defeito.
  const sobra = Math.abs(sg - prev) < 0.005 ? 0 : sg - prev;
  console.log(rotulo(id).padEnd(26) + num(sg).padStart(9) + num(prev).padStart(10)
    + num(sobra).padStart(7));
}
console.log('  `cadência` = 1 − golpes por Tick. A SOBRA é o que a cadência não explica:');
console.log('  positiva quer dizer Ticks sem golpe além dos que o ciclo já obriga (colisão).');

// ================================================ C · o contexto, por batalha
console.log('\n── C · O CONTEXTO, por batalha · TOTAL das duas fases · todas as batalhas ──');
console.log('célula'.padEnd(26) + '  Ticks  t.fuga  paradas  golpes  gestos   fim dominante');
for (const [id, ls] of daFatia(PRINCIPAL)) {
  const t = med(ls.map((l) => l.ticks));
  const tf = med(ls.map((l) => l.tickDaFuga).filter((x) => x != null));
  const p = med(ls.map((l) => l.paradas.i + l.paradas.ii + l.paradas.iii));
  const g = med(ls.map((l) => l.golpesAplicados));
  const ge = med(ls.map((l) => l.gestos));
  const fins = {};
  for (const l of ls) fins[l.fim] = (fins[l.fim] || 0) + 1;
  const dom = Object.entries(fins).sort((a, b) => b[1] - a[1])[0];
  console.log(rotulo(id).padEnd(26) + num(t, 1).padStart(7) + num(tf, 1).padStart(8)
    + num(p, 1).padStart(9) + num(g, 1).padStart(8) + num(ge, 0).padStart(8)
    + `   ${dom[0]} (${((dom[1] / ls.length) * 100).toFixed(0)}%)`);
}

// ============================================================= o que é ⚑
console.log('\n── O QUE FOI INVENTADO ──');
for (const x of manifesto.inventado) console.log(`  ⚑ ${x}`);

// =========================================================== OS ALARMES (§5)
//
// Ninguém vai olhar depois. Cada sinal de bateria ineficaz é conferido aqui e
// impresso ALTO, fora de qualquer tabela. Silêncio aqui é a única forma de a
// bateria valer alguma coisa.

// 2 · contador de ocasião em zero onde ele deveria morder
const somaSub = (k, filtro = () => true) =>
  boas.filter(filtro).reduce((x, l) => x + (l.paradasSub?.[k] || 0), 0);
const comDistancia = (l) => (infoDe(l.celula).dist || 1) > 1;
if (!somaSub('reprojetar', comDistancia)) {
  alarme('`reprojetar` em ZERO nas células com distância: o eixo E2 não está mordendo');
}
if (!somaSub('fugir')) alarme('`fugir` em ZERO: o limiar nunca disparou e a fase de fuga não existe');
const raspoes = boas.reduce((x, l) => x + (l.vereditos?.raspao || 0), 0);
if (!raspoes) alarme('nenhum RASPÃO em toda a bateria: o Quase-Acerto não está sendo exercitado');
const soRes = boas.reduce((x, l) => x + (l.quadro?.soResolveu || 0), 0);
if (!soRes) alarme('`só resolveu` em ZERO: a quarta célula do quadro nunca acontece');
// E4 TEM DE MORDER MAIS QUE A ÂNCORA. O eixo existe para produzir o alvo que
// não se alcança, e o alvo que não se alcança aparece como RE-PROJEÇÃO. Se a
// célula de passo 2× não re-projeta mais que a âncora dela, o eixo é inerte e
// a linha dele no relatório não diz nada.
for (const c of CEL.filter((x) => x.passoMult > 1)) {
  const alvo = porCelula.get(c.id) || [];
  const anc = porCelula.get(`${c.ciclo}-media-3x3-${c.nivelLimiar}`) || [];
  if (!alvo.length || !anc.length) continue;
  const rp = (ls) => med(ls.map((l) => l.paradasSub?.reprojetar || 0));
  if (rp(alvo) <= rp(anc)) {
    alarme(`E4 INERTE em ${rotuloCheio(c.id)}: re-projeta ${num(rp(alvo), 1)} contra`
      + ` ${num(rp(anc), 1)} da âncora. O robô não corre do alvo, ele avança para ele:`
      + ' a assimetria de passo só morde na fuga, e a fuga é curta');
  }
}

// 3 · variância entre repetições contra variância entre células
{
  const metric = (l) => l.fases.combate.paradasPorTick.media;
  const dentro = med([...porCelula.values()].map((ls) => varia(ls.map(metric))).filter((x) => x != null));
  const entre = varia([...porCelula.values()].map((ls) => med(ls.map(metric))));
  console.log(`\n  variância entre repetições ${num(dentro, 4)} · entre células ${num(entre, 4)}`);
  if (dentro >= entre) {
    alarme(`variância DENTRO da célula (${num(dentro, 4)}) ≥ variância ENTRE células`
      + ` (${num(entre, 4)}): os eixos não estão fazendo nada`);
  }
}

// 4 · toda célula estourando o teto
{
  const estouram = [...porCelula.entries()].filter(([, ls]) => ls.every((l) => l.fim === 'estourou'));
  if (estouram.length === porCelula.size) alarme('TODAS as células estouram o teto: nada termina');
  else if (estouram.length) {
    // Sem repetir o rótulo por nível de limiar: a mesma célula aparece uma vez
    // por nível, e a lista fica ilegível dizendo tudo duas vezes.
    const nomes = [...new Set(estouram.map(([id]) => rotuloCheio(id)))];
    console.log(`
  ${estouram.length} de ${porCelula.size} células estouram o teto em 100% das voltas`);
    console.log(`  (${nomes.length} rótulos, um por nível de limiar): ${nomes.join(', ')}`);  }
}

// 5 · distribuição degenerada (p10 = p90) numa métrica principal
{
  const degeneradas = [];
  for (const [id, ls] of porCelula) {
    const p10 = med(ls.map((l) => l.fases.combate.paradasPorTick.p10));
    const p90 = med(ls.map((l) => l.fases.combate.paradasPorTick.p90));
    if (p10 != null && p90 != null && Math.abs(p90 - p10) < 1e-9) degeneradas.push(rotuloCheio(id));
  }
  if (degeneradas.length) {
    alarme(`p10 = p90 em paradas/Tick (combate) em ${degeneradas.length} célula(s):`
      + ' a distribuição é degenerada e o percentil não diz nada · '
      + degeneradas.slice(0, 6).join(', ')
      + (degeneradas.length > 6 ? ` e mais ${degeneradas.length - 6}` : ''));
  }
}

// 6 · fuga-consumada acima de 90% numa célula
{
  const engolidas = [];
  for (const [id, ls] of porCelula) {
    const f = ls.filter((l) => l.fim === 'fuga-consumada').length / ls.length;
    if (f > 0.9) engolidas.push(`${rotuloCheio(id)} ${pct(f)}`);
  }
  if (engolidas.length) {
    alarme(`fuga-consumada acima de 90% em ${engolidas.length} célula(s): a fase de fuga`
      + ' engoliu a batalha · ' + engolidas.slice(0, 6).join(', ')
      + (engolidas.length > 6 ? ` e mais ${engolidas.length - 6}` : ''));
  }
}

console.log('\n' + '='.repeat(74));
if (alarmes.length) {
  console.log(`✘✘✘  ${alarmes.length} SINAL(IS) DE BATERIA INEFICAZ  ✘✘✘`);
  for (const a of alarmes) console.log(`  ✘ ${a}`);
  console.log('\n  Um sinal aceso NÃO invalida a bateria sozinho: ele diz que aquela leitura');
  console.log('  precisa de explicação escrita antes de virar número. Sem explicação, não sai.');
} else {
  console.log('✓  nenhum sinal de bateria ineficaz');
}
console.log('='.repeat(74));
console.log(`\n  reexecutar uma batalha sozinha:\n    ${manifesto.reexecutar || '(manifesto antigo)'}`);
