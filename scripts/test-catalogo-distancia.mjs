// test-catalogo-distancia.mjs · os números do catálogo de Arremesso e tiro contra as decisões (rodada 1).
//
// O QUE ISTO GUARDA. `armas.json` e `regras.json` `combate.distancia` carregam, desde a rodada 1 do
// plano de reescrita (10/10/2026), os números das D-072 (Efetiva), D-074 (Funda e atlatl), D-075 (arcos
// e bestas), D-076 (catálogo de Arremesso) e D-082 (Velocidades e dano das classes de tiro). Nenhum outro
// teste olha para eles: `validate-data` só confere a FORMA (a Efetiva é par e toda arma de tiro tem uma), e
// o `test-combate-tempo` confere o P/G/R que a fórmula de hoje dá, sem saber qual número a decisão pediu.
// Aqui a TABELA DA DECISÃO está escrita à mão, linha por linha, e o catálogo tem de bater com ela.
//
// O que NÃO está aqui, de propósito: o racha P/G/R da D-082 (Preparo e Recuperação por classe), que entra
// com o motor na rodada 4a, e os preços, que esperam a economia.
//
// A prova de que ele acusa: depois de conferir o catálogo de verdade, o teste estraga cópias dele (uma
// Efetiva, uma Velocidade, a ausência de uma arma, a presença dos Dardos, a tabela dos arcos) e exige que
// cada estrago seja acusado.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const ARMAS = ler('src/data/armas.json');
const REGRAS = ler('src/data/regras.json');
const EXTRAS = ler('src/data/armas-extras.json');

// id: [Velocidade, bônus de dano (1d6 + b), Acerto, Efetiva (m), peso (kg), tipo principal, N de perfuração]
const TABELA = {
  // Arremesso (D-076, 2f §10)
  'shuriken': [4, -4, 1, 10, 0.05, 'perfurante', 0],
  'mini-faca': [4, -4, 1, 8, 0.1, 'perfurante', 0],
  'kunai': [4, -4, 1, 8, 0.15, 'perfurante', 0],
  'adaga-de-arremesso': [5, -2, 1, 10, 0.25, 'perfurante', 0],
  'plumbata': [5, -2, 0, 14, 0.2, 'perfurante', 1],
  'bumerangue': [5, -2, 1, 20, 0.3, 'impacto', 0],
  'bumerangue-de-retorno-cortante': [5, -2, 1, 20, 0.3, 'corte', 0],
  'bumerangue-de-caca': [6, 0, 0, 16, 0.7, 'impacto', 0],
  'bumerangue-de-caca-cortante': [6, 0, 0, 16, 0.7, 'corte', 0],
  'machado-de-arremesso': [6, 0, 1, 12, 0.7, 'corte', 0],
  'azagaia': [6, 0, 1, 16, 0.8, 'perfurante', 1],
  'pilum': [6, 0, 1, 12, 2, 'perfurante', 2],
  'boleadeira': [6, -4, 0, 16, 0.6, 'impacto', 0],
  'rede': [6, 0, 0, 4, 3, 'impacto', 0],
  'funda': [6, 0, 1, 26, 0.1, 'impacto', 0],
  // Arcos e bestas (D-072, D-075, D-082)
  'arco-curto': [6, -2, 2, 30, null, 'perfurante', 1],
  'arco-longo': [7, 0, 0, 50, null, 'perfurante', 1],
  'arco-composto': [7, 2, 0, 70, null, 'perfurante', 1],
  'besta-pequena': [9, 2, 1, 40, null, 'perfurante', 1],
  'besta-media': [12, 4, 1, 60, null, 'perfurante', 1],
  'besta-grande': [15, 8, 1, 80, null, 'perfurante', 2],
};
const DISTMAX_LEGADO = { 'adaga-de-arremesso': 10, 'machado-de-arremesso': 12, azagaia: 40, funda: 200, bumerangue: 50, rede: 5, pilum: 25 };
const SEM_DISTMAX = ['plumbata', 'shuriken', 'mini-faca', 'kunai', 'boleadeira', 'bumerangue-de-caca', 'bumerangue-de-caca-cortante', 'bumerangue-de-retorno-cortante'];
// A reforma de P/G/R do TIRO (D-082), classe a classe: [Velocidade, Preparo, Golpe, Recuperação]
const REFORMA = {
  'arremesso-leve': [4, 2, 1, 1],
  'arremesso-medio': [5, 3, 1, 1],
  'arremesso-pesado': [6, 3, 1, 2],
  'funda': [6, 4, 1, 1],
  'arco-curto': [6, 4, 1, 1],
  'arco-longo-composto': [7, 4, 1, 2],
  'besta-pequena': [9, 7, 1, 1],
  'besta-media': [12, 9, 1, 2],
  'besta-grande': [15, 12, 1, 2],
  'azagaia-com-atlatl': [8, 5, 1, 2],
};
const ARCOS_POR_FORCA = {
  curto: [50, 90, 120, 140, 155, 170, 180, 190],
  longo: [100, 180, 250, 295, 325, 350, 370, 390],
  composto: [120, 215, 300, 355, 390, 420, 445, 465],
};

/** Devolve a lista de divergências entre o catálogo dado e as decisões. Vazia = confere. */
function conferir(armas, regras, extras) {
  const f = [];
  const por = Object.fromEntries(armas.map((x) => [x.id, x]));
  for (const [id, [vel, dano, acerto, ef, peso, tipo, pen]] of Object.entries(TABELA)) {
    const x = por[id];
    if (!x) { f.push(`arma ${id} sumiu do catálogo`); continue; }
    const a = x.arma;
    const real = [a.ticks, a.danoBonus, a.acerto, a.efetiva, a.tipoDano, a.pen];
    const esp = [vel, dano, acerto, ef, tipo, pen];
    if (JSON.stringify(real) !== JSON.stringify(esp)) f.push(`${id}: Velocidade, dano, Acerto, Efetiva, tipo e N são ${JSON.stringify(real)}, a decisão pede ${JSON.stringify(esp)}`);
    if (a.dado !== 1) f.push(`${id}: dado ${a.dado}, todas as de tiro e arremesso rolam 1d6`);
    if (peso != null && x.peso !== peso) f.push(`${id}: peso ${x.peso} kg, a decisão pede ${peso} kg`);
    if (a.efetiva % 2 !== 0) f.push(`${id}: Efetiva ${a.efetiva} ímpar`);
    if (a.maos !== (id.startsWith('arco') || id.startsWith('besta') ? 2 : 1)) f.push(`${id}: Mãos ${a.maos}`);
  }
  if (por.dardos) f.push('os Dardos voltaram ao catálogo (D-076: a Plumbata ocupa o lugar deles)');
  // Os que ainda guardam o `distMax` legado nunca o têm abaixo da Efetiva, e arcos e bestas não perderam o do Grid.
  for (const x of armas) {
    const a = x.arma;
    if (a?.distMax != null && a.efetiva != null && a.distMax < a.efetiva) f.push(`${x.id}: distMax ${a.distMax} abaixo da Efetiva ${a.efetiva}`);
  }
  const DM = { 'arco-curto': 120, 'arco-longo': 250, 'arco-composto': 300, 'besta-pequena': 100, 'besta-media': 200, 'besta-grande': 300 };
  for (const [id, m] of Object.entries(DM)) if (por[id]?.arma.distMax !== m) f.push(`${id}: distMax ${por[id]?.arma.distMax}, o Grid lê ${m}`);
  // O `distMax` LEGADO das 7 armas de arremesso antigas é o que o Interpor do Grid lê (alcance.ts), e a rodada 1
  // o deixou intacto por causa da D-054. Os números ficam presos aqui; mudá-los é da passada do Grid (N22).
  for (const [id, m] of Object.entries(DISTMAX_LEGADO)) if (por[id]?.arma.distMax !== m) f.push(`${id}: distMax ${por[id]?.arma.distMax}, o legado que o Grid lê é ${m}`);
  // E as 8 armas novas não o têm: sem `distMax` o Interpor não mede alcance nem reta para elas (N22).
  for (const id of SEM_DISTMAX) if (por[id]?.arma.distMax != null) f.push(`${id}: ganhou distMax ${por[id].arma.distMax}, e a rodada 1 as deixou sem`);
  // Classes e Força máxima
  for (const id of ['funda', 'plumbata', 'rede', 'boleadeira', 'shuriken']) if (por[id]?.arma.classe !== 'arremesso') f.push(`${id}: classe ${por[id]?.arma.classe}, esperava arremesso`);
  if (por['arco-curto']?.arma.forcaCap !== 3) f.push('Arco Curto sem a Força máxima 3 (D-075)');
  for (const id of ['arco-longo', 'arco-composto']) if (por[id]?.arma.forcaCap != null) f.push(`${id}: Força máxima definida por padrão (D-075 não dá)`);
  // A Plumbata: projétil rápido, mas Bloqueável (D-076, adendo 5)
  const tp = por.plumbata?.tags || [];
  if (!tp.includes('projétil veloz') || !tp.includes('bloqueável')) f.push('Plumbata sem as tags de projétil rápido e bloqueável');
  // Bumerangues: um só id antigo vira o de retorno em Impacto
  if (por.bumerangue?.nome !== 'Bumerangue de retorno') f.push('o id `bumerangue` não é o Bumerangue de retorno');
  // regras.json combate.pgr.reforma (P/G/R do tiro, D-082): a tabela da decisao, e cada arma na sua classe
  const RF = regras?.combate?.pgr?.reforma?.tiro;
  if (!Array.isArray(RF)) f.push('regras.json sem combate.pgr.reforma.tiro');
  else {
    const porId = Object.fromEntries(RF.map((c) => [c.id, c]));
    for (const [id, esp] of Object.entries(REFORMA)) {
      const c = porId[id];
      if (!c) { f.push(`reforma: falta a classe ${id}`); continue; }
      const real = [c.velocidade, c.preparo, c.golpe, c.recuperacao];
      if (JSON.stringify(real) !== JSON.stringify(esp)) f.push(`reforma ${id}: V/P/G/R ${JSON.stringify(real)}, a D-082 pede ${JSON.stringify(esp)}`);
      if (c.preparo + c.golpe + c.recuperacao !== c.velocidade) f.push(`reforma ${id}: P + G + R nao fecha a Velocidade`);
      for (const aid of c.armas || []) {
        if (por[aid]?.arma.ticks !== c.velocidade) f.push(`reforma ${id}: ${aid} tem Velocidade ${por[aid]?.arma.ticks} no catalogo, a classe pede ${c.velocidade}`);
      }
    }
    if (RF.length !== Object.keys(REFORMA).length) f.push(`reforma: ${RF.length} classes, esperava ${Object.keys(REFORMA).length}`);
    // toda arma de tiro e arremesso do catalogo esta em exatamente uma classe
    const donas = {};
    for (const c of RF) for (const aid of c.armas || []) donas[aid] = (donas[aid] || 0) + 1;
    for (const x of armas) {
      if (!x.arma || (x.arma.classe !== 'distancia' && x.arma.classe !== 'arremesso')) continue;
      if ((donas[x.id] || 0) !== 1) f.push(`reforma: ${x.id} esta em ${donas[x.id] || 0} classes (tem de ser 1)`);
    }
    const atl = RF.find((c) => c.id === 'azagaia-com-atlatl');
    if (atl && extras?.[0]?.efeito?.velocidadeDaAzagaia !== atl.velocidade) f.push('reforma: a azagaia com atlatl nao bate com armas-extras.json');
  }
  // regras.json combate.distancia
  const D = regras?.combate?.distancia;
  if (!D) { f.push('regras.json sem combate.distancia'); return f; }
  if (D.efetiva?.penPorIncremento !== -3 || D.efetiva?.ticksDeVooPorIncremento !== 1) f.push('Efetiva: −3 e +1 Tick por incremento (D-072, D-073)');
  if (D.maxima?.forcaAcimaDeContaComo !== 8) f.push('Máxima: Força acima de 8 conta como 8 (D-075)');
  if (JSON.stringify(D.maxima?.arcos?.porForca) !== JSON.stringify(ARCOS_POR_FORCA)) f.push('Máxima dos arcos por Força diferente da D-075');
  if (JSON.stringify(D.maxima?.bestas) !== JSON.stringify({ pequena: 100, media: 200, grande: 300 })) f.push('Máxima das bestas diferente da D-075');
  if (D.maxima?.arcos?.forcaMaximaPadrao?.curto !== 3) f.push('Força máxima padrão do Curto diferente de 3 (D-075)');
  if (D.maxima?.multiplicadores?.funda !== 2 || D.maxima?.multiplicadores?.atlatl !== 2) f.push('Funda e atlatl dobram a Máxima (D-074)');
  // Atlatl: item extra, não arma
  const at = (extras || []).find((e) => e.id === 'atlatl');
  if (!at) f.push('o atlatl sumiu de armas-extras.json');
  else {
    if (JSON.stringify(at.so) !== JSON.stringify(['azagaia'])) f.push('atlatl: só com a azagaia');
    if (at.efeito?.maximaMult !== 2 || at.efeito?.danoForcaMais !== 1 || at.efeito?.preparoMais !== 2 || at.efeito?.velocidadeDaAzagaia !== 8 || at.efeito?.maos !== 1 || at.efeito?.mudaEfetiva !== false) f.push('atlatl: efeito diferente da D-074');
  }
  if (armas.some((x) => x.id === 'atlatl')) f.push('o atlatl entrou em armas.json (a ficha o listaria como arma)');
  return f;
}

const falhas = [];
// O id `dardos` não pode sobrar na arte nem nas ferramentas de imagem (a Plumbata ocupa o lugar e a arte do dardo).
for (const rel of ['scripts/folhas-ia.json', 'scripts/baixar-imagens-equip.mjs', 'src/styles/arte-equip.css']) {
  const t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (/(id['"]?: ?['"]dardos['"]|arte-dardos)/.test(t)) falhas.push(`${rel}: ainda aponta para o id "dardos"`);
  if (!/plumbata/.test(t)) falhas.push(`${rel}: não cita a plumbata (a arte e as ferramentas de imagem seguem o catálogo)`);
}
const real = conferir(ARMAS, REGRAS, EXTRAS);
for (const x of real) falhas.push(x);

// ---- o teste acusa: cada estrago numa cópia tem de aparecer ----
const copia = (o) => JSON.parse(JSON.stringify(o));
const estragos = {
  'Efetiva da Kunai trocada': (A) => { A.find((x) => x.id === 'kunai').arma.efetiva = 10; },
  'Velocidade da Boleadeira trocada': (A) => { A.find((x) => x.id === 'boleadeira').arma.ticks = 5; },
  'Plumbata sem Bloqueio': (A) => { const t = A.find((x) => x.id === 'plumbata'); t.tags = t.tags.filter((g) => g !== 'bloqueável'); },
  'Arco Curto sem Força máxima': (A) => { delete A.find((x) => x.id === 'arco-curto').arma.forcaCap; },
  'Funda sumiu': (A) => A.splice(A.findIndex((x) => x.id === 'funda'), 1),
  'Dardos voltaram': (A) => { const d = copia(A.find((x) => x.id === 'plumbata')); d.id = 'dardos'; A.push(d); },
  'atlatl em armas.json': (A) => { A.push({ id: 'atlatl', nome: 'Atlatl', arma: null }); },
  'peso da Rede': (A) => { A.find((x) => x.id === 'rede').peso = 1.5; },
  'Velocidade da Funda no catalogo (a reforma pede 6)': (A) => { A.find((x) => x.id === 'funda').arma.ticks = 5; },
  'distMax da azagaia': (A) => { A.find((x) => x.id === 'azagaia').arma.distMax = 41; },
  'distMax da Funda': (A) => { A.find((x) => x.id === 'funda').arma.distMax = 199; },
  'distMax do bumerangue': (A) => { A.find((x) => x.id === 'bumerangue').arma.distMax = 51; },
  'distMax da adaga de arremesso sumiu': (A) => { delete A.find((x) => x.id === 'adaga-de-arremesso').arma.distMax; },
  'distMax na Plumbata': (A) => { A.find((x) => x.id === 'plumbata').arma.distMax = 30; },
};
for (const [nome, estraga] of Object.entries(estragos)) {
  const A = copia(ARMAS); estraga(A);
  if (conferir(A, REGRAS, EXTRAS).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
}
{
  const R = copia(REGRAS); R.combate.distancia.maxima.arcos.porForca.longo[2] = 251;
  if (conferir(ARMAS, R, EXTRAS).length === 0) falhas.push('o teste NÃO acusou a tabela dos arcos adulterada');
  const R2 = copia(REGRAS); R2.combate.distancia.maxima.multiplicadores.funda = 1;
  if (conferir(ARMAS, R2, EXTRAS).length === 0) falhas.push('o teste NÃO acusou a Funda sem o ×2');
  const R3 = copia(REGRAS); R3.combate.pgr.reforma.tiro.find((c) => c.id === 'besta-grande').preparo = 13;
  if (conferir(ARMAS, R3, EXTRAS).length === 0) falhas.push('o teste NAO acusou o Preparo da Besta Grande alterado');
  const R4 = copia(REGRAS); R4.combate.pgr.reforma.tiro.find((c) => c.id === 'funda').armas = [];
  if (conferir(ARMAS, R4, EXTRAS).length === 0) falhas.push('o teste NAO acusou a Funda fora de toda classe');
  const E2 = copia(EXTRAS); E2[0].so = ['azagaia', 'plumbata'];
  if (conferir(ARMAS, REGRAS, E2).length === 0) falhas.push('o teste NÃO acusou o atlatl com a Plumbata');
}

if (falhas.length) {
  console.error(`✘ test-catalogo-distancia: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
console.log(`✓ test-catalogo-distancia · ${Object.keys(TABELA).length} armas de tiro e arremesso, a tabela dos arcos, as bestas, a Funda e o atlatl batem com as D-072 a D-076 e D-082 · ${Object.keys(estragos).length + 3} estragos acusados`);
