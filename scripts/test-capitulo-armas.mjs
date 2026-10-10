// test-capitulo-armas.mjs · as tabelas de Armas & Armaduras (o texto) contra o catálogo (os dados).
//
// O QUE ISTO GUARDA. O capítulo XIII (`src/content/chapters/armas-e-armaduras.md`) traz à mão as tabelas de
// Arremesso, de Atirador, de Classes e a Máxima dos arcos por Força. `armas.json` e `regras.json`
// `combate.distancia` carregam os mesmos números. O `test-catalogo-distancia` prende o catálogo à tabela das
// DECISÕES, mas nunca abre o capítulo; o `gen-cap-itens` gera só a tabela de PREÇOS. Sem este teste, a rodada
// que mudasse uma Velocidade, um dano ou uma Efetiva no catálogo e esquecesse o capítulo passava verde (o
// veredito 149 achou a promessa sem asserção). Daqui em diante cada número que muda tem de mudar nas duas casas.
//
// O que se confere, por arma, nas tabelas de Arremesso e de Atirador: Velocidade, dado e bônus de dano, Acerto,
// Efetiva, Peso (Arremesso), Mãos, o modo principal e o Nível de Perfuração. Mais: a Velocidade de cada linha da
// tabela de Classes, a tabela de Máxima por Força no arco e as Máximas das bestas, que o texto repete na linha
// de cada besta.
//
// Os bumerangues em Cortante e o atlatl não estão nas tabelas (são variantes e item extra), e a Rede não tem
// dano ("não causa dano"): isso também é conferido.
//
// A prova de que ele acusa: depois de conferir o capítulo de verdade, o teste estraga cópias do TEXTO e cópias do
// CATÁLOGO (uma célula de cada tabela, uma linha sumida, a tabela da Máxima) e exige que cada estrago seja acusado.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const CAP = ler('src/content/chapters/armas-e-armaduras.md').replace(/\r\n/g, '\n');
const ARMAS = JSON.parse(ler('src/data/armas.json'));
const REGRAS = JSON.parse(ler('src/data/regras.json'));

const limpa = (c) => c.replace(/\*\*/g, '').replace(/`/g, '').replace(/−/g, '-').trim();

/** A primeira tabela de pipes depois de `marcador`: { cab: [...], linhas: [[...], ...] }. */
function tabelaApos(texto, marcador) {
  const i = texto.indexOf(marcador);
  if (i < 0) return null;
  const linhas = texto.slice(i).split('\n');
  let k = 0;
  while (k < linhas.length && !linhas[k].startsWith('|')) k++;
  const tab = [];
  while (k < linhas.length && linhas[k].startsWith('|')) { tab.push(linhas[k]); k++; }
  if (tab.length < 3) return null;
  const celulas = (l) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(limpa);
  return { cab: celulas(tab[0]), linhas: tab.slice(2).map(celulas) };
}

const num = (s) => { const m = /-?\d+(?:[.,]\d+)?/.exec(String(s)); return m ? Number(m[0].replace(',', '.')) : NaN; };
/** "1d6-4" -> { dado: 1, bonus: -4 }; "1d6" -> { dado: 1, bonus: 0 }. */
function dano(s) {
  const m = /^(\d)d6([+-]\d+)?$/.exec(s);
  return m ? { dado: Number(m[1]), bonus: m[2] ? Number(m[2]) : 0 } : null;
}
/** "50 g" -> 0.05; "2 kg" -> 2; "pedra de 100 g" -> 0.1. */
function pesoKg(s) {
  const m = /(\d+(?:[.,]\d+)?)\s*(kg|g)\b/.exec(s);
  return m ? (m[2] === 'kg' ? num(m[1]) : num(m[1]) / 1000) : null;
}
const TIPO = { I: 'impacto', C: 'corte', P: 'perfurante' };

function conferir(cap, armas, regras) {
  const f = [];
  const porNome = Object.fromEntries(armas.map((x) => [x.nome, x]));
  const col = (tab, nome) => tab.cab.findIndex((c) => c.toLowerCase() === nome.toLowerCase());

  for (const [marcador, comPeso] of [['#### Arremesso', true], ['#### Atirador', false]]) {
    const tab = tabelaApos(cap, marcador);
    if (!tab) { f.push(`o capítulo não tem a tabela de ${marcador.slice(5)}`); continue; }
    const I = Object.fromEntries(['Arma', 'Modos', 'Velocidade', 'Dano', 'Acerto', 'Efetiva', 'Mãos'].map((n) => [n, col(tab, n)]));
    const iPeso = col(tab, 'Peso');
    if (Object.values(I).some((v) => v < 0) || (comPeso && iPeso < 0)) { f.push(`${marcador}: colunas faltando (${tab.cab.join(' | ')})`); continue; }
    for (const l of tab.linhas) {
      const nome = l[I.Arma];
      const x = porNome[nome];
      if (!x) { f.push(`${marcador}: "${nome}" não existe no catálogo`); continue; }
      const a = x.arma;
      const quando = `${nome}`;
      if (num(l[I.Velocidade]) !== a.ticks) f.push(`${quando}: Velocidade ${l[I.Velocidade]} no capítulo, ${a.ticks} no catálogo`);
      if (num(l[I.Acerto]) !== a.acerto) f.push(`${quando}: Acerto ${l[I.Acerto]} no capítulo, ${a.acerto} no catálogo`);
      if (num(l[I.Efetiva]) !== a.efetiva) f.push(`${quando}: Efetiva ${l[I.Efetiva]} no capítulo, ${a.efetiva} m no catálogo`);
      if (num(l[I['Mãos']]) !== a.maos) f.push(`${quando}: Mãos ${l[I['Mãos']]} no capítulo, ${a.maos} no catálogo`);
      if (comPeso && Math.abs((pesoKg(l[iPeso]) ?? -1) - x.peso) > 1e-9) f.push(`${quando}: Peso "${l[iPeso]}" no capítulo, ${x.peso} kg no catálogo`);
      // dano: a Rede não tem
      if (/não causa dano/.test(l[I.Dano])) {
        if (!/prende/.test(x.tags.join(' '))) f.push(`${quando}: "não causa dano" numa arma que não prende`);
      } else {
        const d = dano(l[I.Dano]);
        if (!d) f.push(`${quando}: dano "${l[I.Dano]}" ilegível`);
        else if (d.dado !== a.dado || d.bonus !== (a.danoBonus || 0)) f.push(`${quando}: dano ${l[I.Dano]} no capítulo, ${a.dado}d6${a.danoBonus || ''} no catálogo`);
      }
      // modo principal e Nível de Perfuração
      const m = /★([ICP])(?:\(N(\d)\))?/.exec(l[I.Modos]);
      if (m) {
        if (TIPO[m[1]] !== a.tipoDano) f.push(`${quando}: modo principal ${m[1]} no capítulo, ${a.tipoDano} no catálogo`);
        if (m[2] != null && Number(m[2]) !== a.pen) f.push(`${quando}: N${m[2]} no capítulo, N${a.pen} no catálogo`);
      } else if (l[I.Modos] !== '·') f.push(`${quando}: Modos "${l[I.Modos]}" ilegível`);
      // as Máximas fixas das bestas, repetidas no Destaque
      const dest = l[tab.cab.length - 1];
      const mx = /Máxima (\d+) m/.exec(dest);
      if (mx) {
        const chave = nome.replace('Besta ', '').toLowerCase().replace('é', 'e');
        const real = regras?.combate?.distancia?.maxima?.bestas?.[chave];
        if (real !== Number(mx[1])) f.push(`${quando}: Máxima ${mx[1]} m no capítulo, ${real} m em regras.json`);
      }
    }
    // toda arma de tiro e arremesso do catálogo que o capítulo lista tem de estar na tabela certa
    const nomes = new Set(tab.linhas.map((l) => l[I.Arma]));
    const esperadas = armas.filter((x) => x.arma && (comPeso ? x.arma.classe === 'arremesso' : x.arma.classe === 'distancia'))
      // os bumerangues em Cortante são variantes: o capítulo os descreve no texto, sem linha própria
      .filter((x) => !/Cortante/.test(x.nome));
    for (const x of esperadas) if (!nomes.has(x.nome)) f.push(`${marcador}: "${x.nome}" está no catálogo e falta na tabela do capítulo`);
  }

  // A Máxima por Força no arco
  const mx = tabelaApos(cap, '| Máxima (m) por Força no arco');
  const real = regras?.combate?.distancia?.maxima?.arcos?.porForca;
  if (!mx || !real) f.push('falta a tabela de Máxima por Força no arco (capítulo ou regras.json)');
  else {
    const nomes = { 'Arco Curto': 'curto', 'Arco Longo': 'longo', 'Arco Composto': 'composto' };
    for (const l of mx.linhas) {
      const chave = nomes[l[0]];
      const vals = l.slice(1).map(num);
      if (JSON.stringify(vals) !== JSON.stringify(real[chave])) f.push(`${l[0]}: Máxima por Força ${JSON.stringify(vals)} no capítulo, ${JSON.stringify(real[chave])} em regras.json`);
    }
    if (mx.linhas.length !== 3) f.push(`a tabela de Máxima por Força tem ${mx.linhas.length} linhas, esperava 3`);
  }

  // A Velocidade de cada linha da tabela de Classes (as de tiro e arremesso)
  const cl = tabelaApos(cap, '## Classes de Arma');
  const vel = (ids) => [...new Set(ids.map((id) => armas.find((x) => x.id === id)?.arma.ticks))].join(', ');
  const velBestas = ['besta-pequena', 'besta-media', 'besta-grande'].map((id) => armas.find((x) => x.id === id)?.arma.ticks);
  const ESP = {
    'Arremesso leve': vel(['shuriken', 'mini-faca', 'kunai']),
    'Arremesso médio': vel(['adaga-de-arremesso', 'plumbata', 'bumerangue']),
    'Arremesso pesado': vel(['bumerangue-de-caca', 'machado-de-arremesso', 'azagaia', 'pilum', 'boleadeira', 'rede']),
    'Funda': vel(['funda']),
    'Arco Curto': vel(['arco-curto']),
    'Arco Longo e Composto': vel(['arco-longo', 'arco-composto']),
    'Besta': `${velBestas[0]}, ${velBestas[1]} e ${velBestas[2]}`,
  };
  if (!cl) f.push('o capítulo não tem a tabela de Classes');
  else {
    const iv = cl.cab.findIndex((c) => c === 'Velocidade');
    for (const [rot, v] of Object.entries(ESP)) {
      const l = cl.linhas.find((r) => r[0] === rot);
      if (!l) { f.push(`Classes: falta a linha "${rot}"`); continue; }
      if (l[iv] !== v) f.push(`Classes, ${rot}: Velocidade "${l[iv]}" no capítulo, "${v}" no catálogo`);
    }
  }
  return f;
}

const falhas = [];
const real = conferir(CAP, ARMAS, REGRAS);
for (const x of real) falhas.push(x);

// ---- o teste acusa: estragos no TEXTO e no CATÁLOGO ----
const copia = (o) => JSON.parse(JSON.stringify(o));
const estragosTexto = {
  'Velocidade da Shuriken no capítulo': (t) => t.replace('| Shuriken | Leve | ★P(N0) | 4 |', '| Shuriken | Leve | ★P(N0) | 5 |'),
  'dano da Boleadeira no capítulo': (t) => t.replace('| Boleadeira | Pesada | ★I | 6 | 1d6−4 |', '| Boleadeira | Pesada | ★I | 6 | 1d6−2 |'),
  'Efetiva do Arco Longo no capítulo': (t) => t.replace('| Arco Longo | Distância | ★P(N1) | 7 | 1d6 | +0 | 50 m |', '| Arco Longo | Distância | ★P(N1) | 7 | 1d6 | +0 | 60 m |'),
  'Peso do Pilum no capítulo': (t) => t.replace('| 12 m | 2 kg | 1 |', '| 12 m | 3 kg | 1 |'),
  'linha da Funda sumiu do capítulo': (t) => t.split('\n').filter((l) => !l.startsWith('| Funda | Funda |')).join('\n'),
  'Máxima do Longo na Força 3 no capítulo': (t) => t.replace('| Arco Longo | 100 | 180 | 250 |', '| Arco Longo | 100 | 180 | 251 |'),
  'Máxima da Besta Média no capítulo': (t) => t.replace('Máxima 200 m', 'Máxima 250 m'),
  'Velocidade da Besta nas Classes': (t) => t.replace('| Besta | 9, 12 e 15 |', '| Besta | 9, 12 e 14 |'),
  'Acerto da Plumbata no capítulo': (t) => t.replace('| Plumbata | Média | ★P(N1) | 5 | 1d6−2 | +0 |', '| Plumbata | Média | ★P(N1) | 5 | 1d6−2 | +1 |'),
};
for (const [nome, estraga] of Object.entries(estragosTexto)) {
  const t = estraga(CAP);
  if (t === CAP) { falhas.push(`o estrago "${nome}" não alterou o capítulo (o teste de teste está torto)`); continue; }
  if (conferir(t, ARMAS, REGRAS).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
}
const estragosCatalogo = {
  'Velocidade da azagaia no catálogo': (A) => { A.find((x) => x.id === 'azagaia').arma.ticks = 7; },
  'Efetiva da Kunai no catálogo': (A) => { A.find((x) => x.id === 'kunai').arma.efetiva = 10; },
  'Peso da Rede no catálogo': (A) => { A.find((x) => x.id === 'rede').peso = 1.5; },
  'dano do Pilum no catálogo': (A) => { A.find((x) => x.id === 'pilum').arma.danoBonus = 2; },
  'N da Plumbata no catálogo': (A) => { A.find((x) => x.id === 'plumbata').arma.pen = 0; },
  'arma nova sem linha no capítulo': (A) => { const n = copia(A.find((x) => x.id === 'kunai')); n.id = 'nova'; n.nome = 'Arma Nova'; A.push(n); },
  'Velocidade do Arco Curto no catálogo': (A) => { A.find((x) => x.id === 'arco-curto').arma.ticks = 5; },
};
for (const [nome, estraga] of Object.entries(estragosCatalogo)) {
  const A = copia(ARMAS); estraga(A);
  if (conferir(CAP, A, REGRAS).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
}
{
  const R = copia(REGRAS); R.combate.distancia.maxima.arcos.porForca.composto[7] = 466;
  if (conferir(CAP, ARMAS, R).length === 0) falhas.push('o teste NÃO acusou a Máxima do Composto alterada em regras.json');
  const R2 = copia(REGRAS); R2.combate.distancia.maxima.bestas.grande = 301;
  if (conferir(CAP, ARMAS, R2).length === 0) falhas.push('o teste NÃO acusou a Máxima da Besta Grande alterada em regras.json');
}

if (falhas.length) {
  console.error(`✘ test-capitulo-armas: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
const total = Object.keys(estragosTexto).length + Object.keys(estragosCatalogo).length + 2;
console.log(`✓ test-capitulo-armas · as tabelas de Arremesso, Atirador, Classes e a Máxima por Força do capítulo batem com armas.json e regras.json · ${total} estragos acusados`);
