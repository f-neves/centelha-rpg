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
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const CAP = ler('src/content/chapters/armas-e-armaduras.md').replace(/\r\n/g, '\n');
const COMB = ler('src/content/chapters/combate.md').replace(/\r\n/g, '\n');
const ACOES = ler('src/content/chapters/acoes-corpo-e-movimento.md').replace(/\r\n/g, '\n');
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
const sinal = (b) => (b ? (b > 0 ? `+${b}` : `-${Math.abs(b)}`) : ''); // o `limpa` já troca o − por -
const d6 = (b) => `1d6${sinal(b)}`;

function conferir(cap, armas, regras, comb = COMB, acoes = ACOES) {
  const f = [];
  const porNome = Object.fromEntries(armas.map((x) => [x.nome, x]));
  const col = (tab, nome) => tab.cab.findIndex((c) => c.toLowerCase() === nome.toLowerCase());

  for (const [marcador, comPeso] of [['#### Arremesso', true], ['#### Atirador', false]]) {
    const tab = tabelaApos(cap, marcador);
    if (!tab) { f.push(`o capítulo não tem a tabela de ${marcador.slice(5)}`); continue; }
    const I = Object.fromEntries(['Arma', 'Modos', 'Velocidade', 'Dano', 'Acerto', 'Efetiva', 'Mãos'].map((n) => [n, col(tab, n)]));
    const iPeso = col(tab, 'Peso');
    const iClasse = col(tab, 'Classe');
    const VEL_CLASSE = { Leve: 4, 'Média': 5, Pesada: 6, Funda: 6 };
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
        else if (d.dado !== a.dado || d.bonus !== (a.danoBonus || 0)) f.push(`${quando}: dano ${l[I.Dano]} no capítulo, ${a.dado > 1 ? a.dado : ''}${d6(a.danoBonus || 0)} no catálogo`);
      }
      // a coluna Classe contra a Velocidade (Arremesso: leve 4, média 5, pesada 6, Funda 6)
      if (comPeso && VEL_CLASSE[l[iClasse]] !== a.ticks) f.push(`${quando}: classe ${l[iClasse]} (Velocidade ${VEL_CLASSE[l[iClasse]]}) no capítulo, Velocidade ${a.ticks} no catálogo`);
      // os modos secundários: "★C · I" lista os secundários depois do ponto-médio; "★I ou ★C" é variante, não modo
      if (!/ ou /.test(l[I.Modos]) && l[I.Modos] !== '·') {
        const partes = l[I.Modos].split('·').map((x) => x.trim());
        const sec = partes.slice(1).map((x) => TIPO[x[0]]).sort();
        const realSec = (a.modos || []).filter((m) => !m.principal).map((m) => m.tipo).sort();
        if (JSON.stringify(sec) !== JSON.stringify(realSec)) f.push(`${quando}: modos secundários ${JSON.stringify(sec)} no capítulo, ${JSON.stringify(realSec)} no catálogo`);
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
    const RFT = regras?.combate?.pgr?.reforma?.tiro || [];
    const classe = (id) => RFT.find((c) => c.id === id)?.armas.map((aid) => armas.find((x) => x.id === aid)).filter(Boolean) || [];
    const faixa = (vs, un = '') => { const u = [...new Set(vs)].sort((x, y) => x - y); return u.length === 1 ? `${sinalA(u[0])}${un}` : `${sinalA(u[0])} a ${sinalA(u[u.length - 1])}${un}`; };
    const sinalA = (n) => (n >= 0 ? `+${n}` : `-${Math.abs(n)}`);
    const ef = (xs) => { const u = [...new Set(xs.map((x) => x.arma.efetiva))].sort((x, y) => x - y); return u; };
    const ESPT = [
      // [linha, classes da reforma, sem a exceção da classe (a Boleadeira e a Rede não pesam no dano), Mãos]
      ['Arremesso leve', ['arremesso-leve'], 1],
      ['Arremesso médio', ['arremesso-medio'], 1],
      ['Arremesso pesado', ['arremesso-pesado'], 1],
      ['Funda', ['funda'], 1],
      ['Arco Curto', ['arco-curto'], 2],
      ['Arco Longo e Composto', ['arco-longo-composto'], 2],
      ['Besta', ['besta-pequena', 'besta-media', 'besta-grande'], 2],
    ];
    const iD = cl.cab.indexOf('Dano'), iA = cl.cab.indexOf('Acerto'), iM = cl.cab.indexOf('Mãos'), iE = cl.cab.indexOf('Estilo');
    for (const [rot, ids, maos] of ESPT) {
      const l = cl.linhas.find((r) => r[0] === rot);
      if (!l) continue; // a falta da linha já foi acusada acima
      const ws = ids.flatMap(classe);
      if (!ws.length) { f.push(`Classes, ${rot}: nenhuma arma na classe da reforma`); continue; }
      // dano: o bônus que a classe de fato tem (a Boleadeira, 1d6−4 na classe pesada, é a exceção declarada)
      const dws = rot === 'Arremesso pesado' ? ws.filter((x) => x.id !== 'boleadeira') : ws;
      const bons = [...new Set(dws.map((x) => x.arma.danoBonus || 0))].sort((x, y) => x - y);
      const esperado = rot === 'Besta' ? '1d6+2, +4 e +8' : rot === 'Arco Longo e Composto' ? `${d6(bons[0])} e ${d6(bons[1])}` : d6(bons[0]);
      const dano = l[iD].replace(/\s*\(.*?\)/g, '').trim();
      if (bons.length > (rot === 'Besta' || rot === 'Arco Longo e Composto' ? 3 : 1)) f.push(`Classes, ${rot}: as armas da classe têm danos diferentes demais (${bons.join(', ')})`);
      else if (dano !== esperado) f.push(`Classes, ${rot}: dano "${dano}" no capítulo, "${esperado}" pelo catálogo`);
      const ace = faixa(ws.map((x) => x.arma.acerto));
      if (l[iA] !== ace) f.push(`Classes, ${rot}: Acerto "${l[iA]}" no capítulo, "${ace}" pelo catálogo`);
      if (num(l[iM]) !== maos || ws.some((x) => x.arma.maos !== maos)) f.push(`Classes, ${rot}: Mãos ${l[iM]} no capítulo, ${maos} esperado (catálogo ${[...new Set(ws.map((x) => x.arma.maos))]})`);
      // a faixa de Efetiva que o Estilo repete
      const es = ef(ws);
      const txt = es.length === 1 ? `Efetiva de ${es[0]} m` : (rot === 'Besta' ? `Efetiva de ${es[0]}, ${es[1]} e ${es[2]} m` : (rot === 'Arco Longo e Composto' ? `Efetiva de ${es[0]} e de ${es[1]} m` : `Efetiva de ${es[0]} a ${es[es.length - 1]} m`));
      if (!l[iE].includes(txt)) f.push(`Classes, ${rot}: o Estilo não diz "${txt}" (Efetiva pelo catálogo)`);
    }
    const iv = cl.cab.findIndex((c) => c === 'Velocidade');
    for (const [rot, v] of Object.entries(ESP)) {
      const l = cl.linhas.find((r) => r[0] === rot);
      if (!l) { f.push(`Classes: falta a linha "${rot}"`); continue; }
      if (l[iv] !== v) f.push(`Classes, ${rot}: Velocidade "${l[iv]}" no capítulo, "${v}" no catálogo`);
    }
  }
  // ---- a prosa com número
  const RFB = regras?.combate?.distancia?.maxima?.bestas;
  if (RFB && !cap.includes(`Pequena ${RFB.pequena} m, Média ${RFB.media} m, Grande ${RFB.grande} m`)) f.push('Armas & Armaduras: o parágrafo das bestas não diz as Máximas de regras.json');
  const efa = (id) => armas.find((x) => x.id === id)?.arma.efetiva;
  const npas = (E, d) => Math.ceil((d - E) / (E / 2));
  for (const [id, d] of [['adaga-de-arremesso', 25], ['arco-longo', 150]]) {
    const E = efa(id); const k = npas(E, d);
    if (!cap.includes(`Efetiva ${E} m) contra um alvo a 25 m dá n = ${npas(efa('adaga-de-arremesso'), 25)} e −${3 * npas(efa('adaga-de-arremesso'), 25)}`) && id === 'adaga-de-arremesso') f.push(`Armas & Armaduras: o exemplo da faca (25 m) não bate com a Efetiva ${E} m (n = ${k})`);
    if (id === 'arco-longo' && !cap.includes(`dá n = ${k} e −${3 * k}`)) f.push(`Armas & Armaduras: o exemplo do Arco Longo (150 m) pede n = ${k} e −${3 * k}`);
  }
  const FX = regras?.forca;
  const maxima = (faa, kg) => FX.arremessoConst * Math.pow(faa, FX.arremessoExpFaa) / Math.pow(Math.max(kg, FX.arremessoApice), FX.arremessoExpMassa);
  const pilum = armas.find((x) => x.id === 'pilum');
  const m86 = String(Math.round(maxima(2, pilum.peso) * 10) / 10).replace('.', ',');
  if (!acoes.includes(`FAA 2 e um pilum de ${String(pilum.peso).replace('.', ',')} kg a Máxima é de uns ${m86} m, contra ${pilum.arma.efetiva} m de Efetiva`)) f.push(`Corpo e Movimento: o exemplo do pilum pede "${m86} m" de Máxima e ${pilum.arma.efetiva} m de Efetiva`);
  const funda = armas.find((x) => x.id === 'funda');
  const vf = [4, 10, 16, 24].map((faa) => Math.round(maxima(faa, funda.peso) * 2));
  if (!acoes.includes(`${vf.slice(0, 3).join(', ')} e ${vf[3]} m com FAA 4, 10, 16 e 24`)) f.push(`Corpo e Movimento: a Máxima da Funda pede "${vf.join(', ')}" para FAA 4, 10, 16 e 24`);
  // ---- o capítulo Combate Físico: a tabela de Preparo, Golpe e Recuperação (rodada 4a) e o que o texto repete dela
  const pg = tabelaApos(comb, '| Classe | Velocidade | Preparo | Golpe | Recuperação |');
  const RF = regras?.combate?.pgr?.reforma?.tiro;
  if (!pg) f.push('Combate: falta a tabela de Preparo, Golpe e Recuperação');
  else if (!Array.isArray(RF)) f.push('regras.json sem combate.pgr.reforma.tiro');
  else {
    const linha = (nome) => pg.linhas.find((r) => r[0] === nome);
    for (const c of RF) {
      const l = linha(c.nome);
      if (!l) { f.push(`Combate: falta a linha "${c.nome}" na tabela de Preparo, Golpe e Recuperação`); continue; }
      const real = l.slice(1).map(num);
      const esp = [c.velocidade, c.preparo, c.golpe, c.recuperacao];
      if (JSON.stringify(real) !== JSON.stringify(esp)) f.push(`Combate, ${c.nome}: V/P/G/R ${JSON.stringify(real)} no capítulo, ${JSON.stringify(esp)} em regras.json`);
    }
    // o corpo a corpo (rodada 4b): a reforma da D-082 em regras.json combate.pgr.reforma.corpoACorpo
    const CCR = regras?.combate?.pgr?.reforma?.corpoACorpo;
    if (!Array.isArray(CCR)) f.push('regras.json sem combate.pgr.reforma.corpoACorpo');
    else for (const c of CCR) {
      const l = linha(c.nome);
      if (!l) { f.push(`Combate: falta a linha "${c.nome}" na tabela de Preparo, Golpe e Recuperação`); continue; }
      const real = l.slice(1).map(num);
      const esp = [c.velocidade, c.preparo, c.golpe, c.recuperacao];
      if (JSON.stringify(real) !== JSON.stringify(esp)) f.push(`Combate, ${c.nome}: V/P/G/R ${JSON.stringify(real)} no capítulo, ${JSON.stringify(esp)} em regras.json`);
    }
    // o texto repete a Besta Grande ("doze Ticks") e o exemplo do Bram (Besta Média): saem do dado
    const grande = RF.find((c) => c.id === 'besta-grande');
    const media = RF.find((c) => c.id === 'besta-media');
    const PALAVRA = { 12: 'doze' };
    if (grande && !new RegExp(`passa \\*\\*${PALAVRA[grande.preparo]} Ticks\\*\\* armando`).test(comb)) f.push(`Combate: o texto da Besta Grande nao diz "${PALAVRA[grande.preparo]} Ticks" armando (Preparo ${grande.preparo})`);
    if (grande && !new RegExp(`Preparo dela é\\s+de \\*\\*${PALAVRA[grande.preparo]} Ticks\\*\\*`).test(comb)) f.push('Combate: a Recarga nao diz que o Preparo da Besta Grande e de doze Ticks');
    if (media) {
      const m = /Ticks 0 ao (\d+) em Preparo.*?no Tick (\d+) em Golpe.*?os Ticks (\d+) e (\d+) são de Recuperação/s.exec(comb);
      if (!m) f.push('Combate: o exemplo do Bram nao tem a forma esperada');
      else if (JSON.stringify(m.slice(1).map(Number)) !== JSON.stringify([media.preparo - 1, media.preparo, media.preparo + 1, media.preparo + 2])) {
        f.push(`Combate: o exemplo do Bram diz Preparo ate o Tick ${m[1]}, Golpe no ${m[2]}, Recuperacao ${m[3]} e ${m[4]}; a Besta Media (P${media.preparo}) pede ${media.preparo - 1}, ${media.preparo}, ${media.preparo + 1} e ${media.preparo + 2}`);
      }
    }
    // as constantes da regra do tempo de voo no texto (regras.json distancia.efetiva) e as frases que não podem sumir
    const DEF = regras?.combate?.distancia?.efetiva;
    if (DEF?.penPorIncremento !== -3 || !comb.includes('−3 × n')) f.push('Combate: a penalidade de −3 × n (regras.json distancia.efetiva.penPorIncremento) não está no texto');
    if (DEF?.ticksDeVooPorIncremento !== 1 || !comb.includes('soma 1 Tick')) f.push('Combate: "soma 1 Tick" por incremento (ticksDeVooPorIncremento) não está no texto');
    if (!comb.includes('O sistema Normal não tem tempo de voo')) f.push('Combate: falta a frase de que o Normal não tem tempo de voo');
    if (!comb.includes('A Plumbata é a exceção')) f.push('Combate: falta a exceção da Plumbata (Bloqueável) na lista de projétil rápido');
    // o JSON da Recarga vence o capítulo: tem de dizer o mesmo (Tick do Golpe, doze Ticks), sem o "catorze" velho
    const rec = regras?.combate?.movimento?.recarga;
    if (!rec || /catorze|último Tick do ciclo/.test(`${rec.texto} ${rec.porque}`)) f.push('regras.json movimento.recarga ainda diz "catorze" ou "último Tick do ciclo"');
    else if (!/Tick do Golpe/.test(rec.texto) || !/doze Ticks/.test(rec.porque)) f.push('regras.json movimento.recarga não diz "Tick do Golpe" e "doze Ticks"');
    // os exemplos do tempo de voo saem da formula e da Efetiva do catalogo
    const ef = (id) => armas.find((x) => x.id === id)?.arma.efetiva;
    const n = (E, d) => Math.ceil((d - E) / (E / 2));
    for (const [id, nome, d] of [['adaga-de-arremesso', 'Adaga de Arremesso', 25], ['arco-longo', 'Arco Longo', 150], ['arco-longo', 'Arco Longo', 250]]) {
      const E = ef(id);
      const k = n(E, d);
      if (!comb.includes(`n = ${k}`)) f.push(`Combate: o exemplo do tempo de voo (${nome} a ${d} m, Efetiva ${E} m) pede n = ${k}`);
      if (!comb.includes(`−${3 * k}</strong>`)) f.push(`Combate: o exemplo do tempo de voo (${nome} a ${d} m) pede −${3 * k} no acerto`);
    }
    if (!comb.includes('Efetiva 10 m') || ef('adaga-de-arremesso') !== 10) f.push('Combate: o exemplo da Adaga de Arremesso cita a Efetiva 10 m e o catalogo diz outra');
    if (!comb.includes('Efetiva 50 m') || ef('arco-longo') !== 50) f.push('Combate: o exemplo do Arco Longo cita a Efetiva 50 m e o catalogo diz outra');
  }

  // ---- o corpo a corpo, a Rajada, a dupla e a Investida (rodada 4b)
  const CC = regras?.combate?.pgr?.reforma?.corpoACorpo;
  const RJ = regras?.combate?.pgr?.reforma?.rajada;
  const DP = regras?.combate?.pgr?.reforma?.dupla;
  const IV = regras?.combate?.pgr?.reforma?.investida;
  if (Array.isArray(CC) && RJ && DP && IV) {
    const cls = (id) => CC.find((c) => c.id === id);
    // Rajada: o ciclo com n golpes é a Velocidade + 2 por golpe extra; o teto vem de regras.json
    const rt = tabelaApos(comb, '| Classe | Golpes no teto | Ciclo com 1, 2 e 3 golpes |');
    if (!rt) f.push('Combate: falta a tabela da Rajada (golpes no teto e ciclo)');
    else for (const [nome, id] of [['Leve', 'leve'], ['Média', 'media'], ['Haste média', 'haste-media'], ['Haste de Guerra', 'haste-guerra'], ['Pesada', 'pesada']]) {
      const l = rt.linhas.find((r) => r[0] === nome);
      const c = cls(id);
      if (!l) { f.push(`Rajada: falta a linha "${nome}"`); continue; }
      const teto = RJ.teto[id];
      const ciclos = Array.from({ length: teto }, (_, k) => c.velocidade + 2 * k);
      const txt = ciclos.length === 3 ? `${ciclos[0]}, ${ciclos[1]} e ${ciclos[2]}` : `${ciclos[0]} e ${ciclos[1]}`;
      if (num(l[1]) !== teto) f.push(`Rajada, ${nome}: teto ${l[1]} no capítulo, ${teto} em regras.json`);
      if (l[2] !== txt) f.push(`Rajada, ${nome}: ciclo "${l[2]}" no capítulo, "${txt}" pela Velocidade ${c.velocidade} e +2 por golpe extra`);
    }
    // dupla
    const dt = tabelaApos(comb, '| Dupla | Preparo | Golpes | Recuperação | Ciclo |');
    if (!dt) f.push('Combate: falta a tabela da empunhadura dupla');
    else for (const [nome, d] of [['Par de armas leves', DP.parDeLeves], ['Arma média na mão hábil', DP.comMedia]]) {
      const l = dt.linhas.find((r) => r[0] === nome);
      if (!l) { f.push(`Dupla: falta a linha "${nome}"`); continue; }
      const real = l.slice(1).map(num);
      const esp = [d.preparo, d.golpes, d.recuperacao, d.ciclo];
      if (JSON.stringify(real) !== JSON.stringify(esp)) f.push(`Dupla, ${nome}: P/G/R/ciclo ${JSON.stringify(real)} no capítulo, ${JSON.stringify(esp)} em regras.json`);
      if (d.preparo + d.golpes + d.recuperacao !== d.ciclo) f.push(`Dupla, ${nome}: P + G + R nao fecha o ciclo`);
    }
    if (DP.parDeLeves.ciclo !== cls('leve').velocidade) f.push('Dupla: o par de leves nao muda o ciclo da leve');
    if (DP.comMedia.ciclo !== cls('media').velocidade + 1) f.push('Dupla: a media pede ciclo +1');
    // Investida: o que se cobre e o Preparo x 4 (andando) e x 7 (investindo)
    const it = tabelaApos(comb, '| Arma | Preparo | Andando | Investindo |');
    if (!it) f.push('Combate: falta a tabela da Investida');
    else {
      const ESPI = { Leve: 'leve', 'Média e Haste média': 'media', 'Haste de Guerra e Pesada': 'pesada' };
      for (const [nome, id] of Object.entries(ESPI)) {
        const l = it.linhas.find((r) => r[0] === nome);
        if (!l) { f.push(`Investida: falta a linha "${nome}"`); continue; }
        const P = cls(id).preparo;
        if (nome === 'Média e Haste média' && cls('haste-media').preparo !== P) f.push('Investida: Media e Haste media tem Preparos diferentes');
        if (nome === 'Haste de Guerra e Pesada' && cls('haste-guerra').preparo !== P) f.push('Investida: Haste de Guerra e Pesada tem Preparos diferentes');
        if (num(l[1]) !== P || num(l[2]) !== P * IV.andandoPorTick || num(l[3]) !== P * IV.investindoPorTick) f.push(`Investida, ${nome}: ${l.slice(1).join(' / ')} no capítulo, ${P} / ${P * IV.andandoPorTick} m / ${P * IV.investindoPorTick} m pelo Preparo`);
      }
      const Pp = cls('pesada').preparo;
      if (!comb.includes(`de martelo (Preparo ${Pp})`) || !comb.includes(`<strong>${Pp * IV.andandoPorTick} metros</strong>`) || !comb.includes(`cobre <strong>${Pp * IV.investindoPorTick}</strong>`)) f.push(`Combate: o exemplo da Sora (martelo, Preparo ${Pp}) pede ${Pp * IV.andandoPorTick} m andando e ${Pp * IV.investindoPorTick} m investindo`);
    }
    // Golpes no mesmo instante: a adaga declara em 4 - Preparo, a espada longa tambem
    const pl = cls('leve').preparo, pm = cls('media').preparo;
    if (!comb.includes(`Duas adagas (Preparo ${pl}) declaradas no <strong>Tick ${4 - pl}</strong> golpeiam no <strong>Tick 4</strong>`) || !comb.includes(`espada longa (Preparo ${pm}) declarada no <strong>Tick ${4 - pm}</strong>`)) f.push(`Combate: o exemplo dos golpes no mesmo instante pede a adaga (Preparo ${pl}) no Tick ${4 - pl} e a espada longa (Preparo ${pm}) no Tick ${4 - pm}`);
    // a regra geral e o custo do Normal
    if (!comb.includes('Toda arma tem **ao menos 1 Tick de Preparo**') || !comb.includes('**2 × Velocidade + 2**')) f.push('Combate: faltam a regra de 1 Tick de Preparo e o custo 2 × Velocidade + 2 do Normal');
    if (/carga voluntária/i.test(comb)) f.push('Combate: sobrou a "carga voluntária" (a Investida vale para toda arma)');
    // D-068, os dois Punhos (cláusula da D-083) e a dupla mista: o texto do livro, sem regra nova
    if (!comb.includes('**Nada dá ataque extra sem dizer que dá.**') || !comb.includes('um gato pode atacar com qualquer das quatro patas ou com a mordida')) f.push('Combate: falta o parágrafo da D-068 (nada dá ataque extra sem dizer que dá, com o gato)');
    if (!comb.includes('**Dois Punhos contam como duas armas leves**') || !comb.includes('(teto de 3 golpes, o da classe leve)') || !comb.includes('**Só as mãos fazem par**') || !comb.includes('Chute, mordida, cauda e patas de animal')) f.push('Combate: falta a cláusula dos dois Punhos (D-083): duas armas leves, Rajada com teto 3, só as mãos fazem par, chute e patas fora');
    if (!comb.includes('o ciclo é o da arma **mais lenta** das duas, em qualquer mão que ela esteja') || !comb.includes('têm o ciclo da dupla com a espada, 7 Ticks (a Velocidade 6 dela mais 1, como na tabela acima)')) f.push('Combate: falta a frase do Mestre para a dupla mista (ciclo da arma mais lenta, com o exemplo da adaga e da espada longa)');
    // D-088: o Bloqueio com a mão nua contra ataque armado (a Margem se perde, o dano da arma passa)
    if (!comb.includes('o dano da arma passa, a Margem não')) f.push('Combate, Esquivar ou Bloquear: falta a remissão da D-088 (o dano da arma passa, a Margem não)');
    if (!cap.includes('A mão nua bloqueia **qualquer ataque armado**') || !cap.includes('**perde os dados de Margem**') || !cap.includes('**toma o dano da arma normalmente**') || !cap.includes('garra, mordida e chifre contam; contra um soco, o Bloqueio com as mãos para tudo') || !cap.includes('só com a aprovação do Mestre a mão nua barra também o dano da arma') || !cap.includes('braçadeira de aço contra uma clava')) f.push('Armas & Armaduras, Luta desarmada: falta o parágrafo da D-088 (a mão nua bloqueia qualquer ataque armado, perde a Margem, toma o dano da arma)');
    if (!cap.includes('Bloqueio 14, mais 1 de cada punho: <strong>16</strong>') || !cap.includes('<strong>só o dano da arma</strong>')) f.push('Armas & Armaduras, Luta desarmada: falta o exemplo do autor da D-088 (Bloqueio 16, Esquiva 8, acerto 15)');
    if (cap.includes('Contra lâmina, o corpo não segura')) f.push('Armas & Armaduras: sobrou o parágrafo "Contra lâmina, o corpo não segura" (a D-088 o substitui)');
    // a leitura c da D-088 (arma numa mão e punho na outra) está em aberto com o autor: nenhuma frase pode somar punho com arma
    const desarmada = (cap.split('## Luta desarmada')[1] || '').split('## Armaduras')[0];
    if (/punho[^.]{0,60}soma[^.]{0,40}(arma|escudo)/i.test(desarmada.replace(/arma ou escudo não somam com ele/g, ''))) f.push('Luta desarmada: uma frase soma punho com arma (leitura c da D-088, em aberto com o autor)');
    // o capítulo Armas & Armaduras: a tabela de exemplos do corpo a corpo e as linhas do corpo a corpo da tabela de Classes
    const NOMECLASSE = {};
    for (const c of CC) for (const aid of c.armas) NOMECLASSE[aid] = c.id === 'punhos' ? 'Leve' : c.nome; // os Punhos são da classe Leve no catálogo, e têm linha própria só no P/G/R
    const ex = tabelaApos(cap, '### Armas Corpo a Corpo');
    if (!ex) f.push('Armas & Armaduras: falta a tabela de armas de exemplo do corpo a corpo');
    else {
      const ix = Object.fromEntries(['Arma', 'Classe', 'Modos', 'Velocidade', 'Dano', 'Acerto', 'Defesa', 'Mãos'].map((n) => [n, ex.cab.indexOf(n)]));
      for (const l of ex.linhas) {
        const x = porNome[l[ix.Arma]];
        if (!x) { f.push(`corpo a corpo: "${l[ix.Arma]}" nao existe no catalogo`); continue; }
        const a = x.arma;
        const q = l[ix.Arma];
        if (l[ix.Classe] !== NOMECLASSE[x.id]) f.push(`${q}: classe "${l[ix.Classe]}" no capítulo, "${NOMECLASSE[x.id]}" pela reforma`);
        if (num(l[ix.Velocidade]) !== a.ticks) f.push(`${q}: Velocidade ${l[ix.Velocidade]} no capítulo, ${a.ticks} no catálogo`);
        if (l[ix.Dano] !== `${a.dado}d6${sinal(a.danoBonus || 0)}`) f.push(`${q}: dano ${l[ix.Dano]} no capítulo, ${a.dado}d6${sinal(a.danoBonus || 0)} no catálogo`);
        if (num(l[ix.Acerto]) !== a.acerto) f.push(`${q}: Acerto ${l[ix.Acerto]} no capítulo, ${a.acerto} no catálogo`);
        if (num(l[ix.Defesa]) !== a.defesaArma) f.push(`${q}: Defesa ${l[ix.Defesa]} no capítulo, ${a.defesaArma} no catálogo`);
        if (num(l[ix['Mãos']]) !== a.maos) f.push(`${q}: Mãos ${l[ix['Mãos']]} no capítulo, ${a.maos} no catálogo`);
        // modos: ★ = principal, sem ★ = secundário
        const toks = l[ix.Modos].split('·').map((t) => t.trim());
        const prin = toks.filter((t) => t.startsWith('★')).map((t) => TIPO[t[1]]).sort();
        const sec = toks.filter((t) => !t.startsWith('★')).map((t) => TIPO[t[0]]).sort();
        const rp = (a.modos || []).filter((m) => m.principal).map((m) => m.tipo).sort();
        const rs = (a.modos || []).filter((m) => !m.principal).map((m) => m.tipo).sort();
        if (JSON.stringify(prin) !== JSON.stringify(rp) || JSON.stringify(sec) !== JSON.stringify(rs)) f.push(`${q}: modos ${l[ix.Modos]} no capítulo (principais ${JSON.stringify(prin)}, secundários ${JSON.stringify(sec)}), catálogo ${JSON.stringify(rp)} e ${JSON.stringify(rs)}`);
      }
      // toda arma de corpo a corpo do catálogo que o capítulo exemplifica
      const nomesEx = new Set(ex.linhas.map((l) => l[ix.Arma]));
      for (const id of ['desarmado', 'adaga', 'espada-curta', 'espada-longa', 'machado', 'lanca', 'alabarda', 'montante', 'martelo-de-guerra']) {
        const x = armas.find((y) => y.id === id);
        if (x && !nomesEx.has(x.nome)) f.push(`corpo a corpo: "${x.nome}" está no catálogo e falta na tabela de exemplos`);
      }
    }
    const clt = tabelaApos(cap, '## Classes de Arma');
    if (clt) {
      const REP = { Leve: ['leve', 'adaga'], 'Média': ['media', 'espada-longa'], Pesada: ['pesada', 'montante'], 'Haste média': ['haste-media', 'lanca'], 'Haste de Guerra': ['haste-guerra', 'alabarda'] };
      const iV = clt.cab.indexOf('Velocidade'), iD = clt.cab.indexOf('Dano'), iA = clt.cab.indexOf('Acerto'), iF = clt.cab.indexOf('Def.'), iM = clt.cab.indexOf('Mãos');
      for (const [rot, [cid, wid]] of Object.entries(REP)) {
        const l = clt.linhas.find((r) => r[0] === rot);
        if (!l) { f.push(`Classes: falta a linha "${rot}"`); continue; }
        const w = armas.find((x) => x.id === wid).arma;
        if (num(l[iV]) !== cls(cid).velocidade) f.push(`Classes, ${rot}: Velocidade ${l[iV]} no capítulo, ${cls(cid).velocidade} pela reforma`);
        if (l[iD] !== `${w.dado}d6${sinal(w.danoBonus || 0)}`) f.push(`Classes, ${rot}: dano ${l[iD]} no capítulo, ${w.dado}d6${sinal(w.danoBonus || 0)} (${wid})`);
        if (num(l[iA]) !== w.acerto) f.push(`Classes, ${rot}: Acerto ${l[iA]} no capítulo, ${w.acerto} (${wid})`);
        if (num(l[iF]) !== w.defesaArma) f.push(`Classes, ${rot}: Defesa ${l[iF]} no capítulo, ${w.defesaArma} (${wid})`);
        if (num(l[iM]) !== w.maos) f.push(`Classes, ${rot}: Mãos ${l[iM]} no capítulo, ${w.maos} (${wid})`);
      }
    }
  }
  return f;
}

const falhas = [];
let TOTAL_ARTE = 0;
// A ficha (informativa) mostra o P/G/R do corpo a corpo pela reforma da D-082 (Punhos 1/1/3), e não pela fórmula velha do motor
const FICHA = ler('src/lib/ficha-engine.ts');
if (!/^\s*const a = anatomiaDaFicha\(w, regras\);$/m.test(FICHA)) falhas.push('ficha-engine: o linhaPGR não chama anatomiaDaFicha (ficha-pgr.ts), que lê a régua do livro (os Punhos sairiam 0/1/4)');
if (!/reforma??.corpoACorpo|ref.corpoACorpo/.test(ler('src/lib/ficha-pgr.ts')) || !/ref.tiro/.test(ler('src/lib/ficha-pgr.ts'))) falhas.push('ficha-pgr: não lê combate.pgr.reforma.corpoACorpo e .tiro');
if (JSON.stringify(ARMAS.find((a) => a.id === 'desarmado').arma.ticks) !== '5' || REGRAS.combate.pgr.reforma.corpoACorpo.find((c) => c.id === 'punhos').preparo !== 1) falhas.push('Punhos: Velocidade 5 no catálogo e Preparo 1 na reforma (1/1/3)');
const real = conferir(CAP, ARMAS, REGRAS, COMB, ACOES);
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
  if (conferir(t, ARMAS, REGRAS, COMB).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
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
  if (conferir(CAP, A, REGRAS, COMB).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
}
{
  const R = copia(REGRAS); R.combate.distancia.maxima.arcos.porForca.composto[7] = 466;
  if (conferir(CAP, ARMAS, R, COMB).length === 0) falhas.push('o teste NÃO acusou a Máxima do Composto alterada em regras.json');
  const R2 = copia(REGRAS); R2.combate.distancia.maxima.bestas.grande = 301;
  if (conferir(CAP, ARMAS, R2, COMB).length === 0) falhas.push('o teste NÃO acusou a Máxima da Besta Grande alterada em regras.json');
  // estragos no TEXTO de Combate Físico e no dado da reforma
  const estragosComb = {
    'Preparo do Arco Curto em Combate': (t) => t.replace('| Arco Curto | 6 | 4 | 1 | 1 |', '| Arco Curto | 6 | 5 | 1 | 0 |'),
    'Recuperação da Besta Média em Combate': (t) => t.replace('| Besta Média | 12 | 9 | 1 | 2 |', '| Besta Média | 12 | 9 | 1 | 3 |'),
    'linha da Funda sumiu de Combate': (t) => t.split('\n').filter((l) => !l.startsWith('| Funda | 6 | 4 |')).join('\n'),
    'Preparo do Leve em Combate (corpo a corpo)': (t) => t.replace('| Leve | 5 | 1 | 1 | 3 |', '| Leve | 5 | 0 | 1 | 4 |'),
    'exemplo do Bram em Combate': (t) => t.replace('Ele fica dos Ticks 0 ao 8 em Preparo', 'Ele fica dos Ticks 0 ao 10 em Preparo'),
    'Besta Grande em Combate': (t) => t.replace('passa **doze Ticks** armando', 'passa **catorze Ticks** armando'),
    'exemplo do tempo de voo em Combate': (t) => t.replace('n = 4, <strong>−12</strong>', 'n = 4, <strong>−9</strong>'),
  };
  for (const [nome, estraga] of Object.entries(estragosComb)) {
    const t = estraga(COMB);
    if (t === COMB) { falhas.push(`o estrago "${nome}" nao alterou Combate (o teste de teste esta torto)`); continue; }
    if (conferir(CAP, ARMAS, REGRAS, t).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
  }
  const estragosMais = {
    'Classe da Plumbata (Pesada) no capítulo': (c, a) => [c.replace('| Plumbata | Média |', '| Plumbata | Pesada |'), a],
    'modo secundário do Machado no capítulo': (c, a) => [c.replace('| Machado de Arremesso | Pesada | ★C · I |', '| Machado de Arremesso | Pesada | ★C |'), a],
    'dano do Arremesso leve nas Classes': (c, a) => [c.replace('| Arremesso leve | 4 | 1d6−4 |', '| Arremesso leve | 4 | 1d6−2 |'), a],
    'Efetiva do Arremesso pesado nas Classes': (c, a) => [c.replace('Efetiva de 4 a 16 m', 'Efetiva de 4 a 18 m'), a],
    'Acerto do Arco Curto nas Classes': (c, a) => [c.replace('| Arco Curto | 6 | 1d6−2 (+Força até 3) | +2 |', '| Arco Curto | 6 | 1d6−2 (+Força até 3) | +1 |'), a],
    'Máximas das bestas na prosa': (c, a) => [c.replace('Média 200 m, Grande 300 m', 'Média 200 m, Grande 350 m'), a],
    'exemplo da faca na prosa': (c, a) => [c.replace('dá n = 3 e −9', 'dá n = 3 e −6'), a],
    'exemplo do pilum em Corpo e Movimento': (c, a) => [c, a.replace('uns 8,6 m', 'uns 9,6 m')],
    'Máxima da Funda em Corpo e Movimento': (c, a) => [c, a.replace('93, 176, 245', '93, 176, 250')],
  };
  for (const [nome, estraga] of Object.entries(estragosMais)) {
    const [c, a] = estraga(CAP, ACOES);
    if (c === CAP && a === ACOES) { falhas.push(`o estrago "${nome}" não alterou nada (o teste de teste está torto)`); continue; }
    if (conferir(c, ARMAS, REGRAS, COMB, a).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
  }
  const estragosCC = {
    'Preparo da Leve em Combate': (c, t) => [c.replace('| Leve | 5 | 1 | 1 | 3 |', '| Leve | 5 | 0 | 1 | 4 |'), t],
    'Haste de Guerra em Combate': (c, t) => [c.replace('| Haste de Guerra | 7 | 3 | 1 | 3 |', '| Haste de Guerra | 7 | 2 | 1 | 4 |'), t],
    'ciclo da Rajada de Média em Combate': (c, t) => [c.replace('| Média | 3 | 6, 8 e 10 |', '| Média | 3 | 6, 8 e 11 |'), t],
    'teto da Rajada de Haste de Guerra em Combate': (c, t) => [c.replace('| Haste de Guerra | 2 | 7 e 9 |', '| Haste de Guerra | 3 | 7 e 9 |'), t],
    'ciclo da dupla com média em Combate': (c, t) => [c.replace('| Arma média na mão hábil | 2 | 2 | 3 | 7 |', '| Arma média na mão hábil | 2 | 2 | 3 | 8 |'), t],
    'Investida da Pesada em Combate': (c, t) => [c.replace('| Haste de Guerra e Pesada | 3 | 12 m | 21 m |', '| Haste de Guerra e Pesada | 3 | 12 m | 24 m |'), t],
    'exemplo da Sora em Combate': (c, t) => [c.replace('de martelo (Preparo 3)', 'de martelo (Preparo 2)'), t],
    'exemplo dos golpes no mesmo instante em Combate': (c, t) => [c.replace('Duas adagas (Preparo 1) declaradas no <strong>Tick 3</strong>', 'Duas adagas (Preparo 1) declaradas no <strong>Tick 2</strong>'), t],
    'parágrafo da D-068 em Combate': (c, t) => [c.replace('**Nada dá ataque extra sem dizer que dá.**', 'Ataque extra.'), t],
    'cláusula dos dois Punhos em Combate': (c, t) => [c.replace('**Dois Punhos contam como duas armas leves**', 'Dois Punhos contam como uma arma'), t],
    'teto dos dois Punhos em Combate': (c, t) => [c.replace('(teto de 3 golpes, o da classe leve)', '(teto de 2 golpes)'), t],
    'frase da dupla mista em Combate': (c, t) => [c.replace('o ciclo é o da arma **mais lenta** das duas', 'o ciclo é o da arma mais rápida das duas'), t],
    'remissão da D-088 em Combate': (c, t) => [c.replace('o dano da arma passa, a Margem não', 'o corpo não segura'), t],
    'parágrafo da D-088 em Luta desarmada': (c, t) => [c, t.replace('**perde os dados de Margem**', 'perde o dano')],
    'frase do Mestre sobre o dano da arma em Luta desarmada': (c, t) => [c, t.replace('só com a aprovação do Mestre a mão nua barra também o dano da arma', 'a mão nua barra também o dano da arma')],
    'exemplo da D-088 em Luta desarmada': (c, t) => [c, t.replace('Bloqueio 14, mais 1 de cada punho: <strong>16</strong>', 'Bloqueio 14, mais 1 de cada punho: <strong>15</strong>')],
    'parágrafo da lâmina de volta em Luta desarmada': (c, t) => [c, t + '\nContra lâmina, o corpo não segura.\n'],
    'carga voluntária de volta em Combate': (c, t) => [c + '\nA carga voluntária compra Preparo.\n', t],
    'Alabarda no capítulo (Velocidade 6)': (c, t) => [c, t.replace('| Alabarda | Haste de Guerra | ★C · ★P(N1) · ★I | 7 |', '| Alabarda | Haste de Guerra | ★C · ★P(N1) · ★I | 6 |')],
    'Lança no capítulo (1d6+2)': (c, t) => [c, t.replace('| Lança | Haste média | ★P(N1) | 6 | 1d6 |', '| Lança | Haste média | ★P(N1) | 6 | 1d6+2 |')],
    'classe da Lança no capítulo': (c, t) => [c, t.replace('| Lança | Haste média |', '| Lança | Haste |')],
    'Defesa da Haste média nas Classes': (c, t) => [c, t.replace('| Haste média | 6 | 1d6 | +1 | +2 | 2 |', '| Haste média | 6 | 1d6 | +1 | +3 | 2 |')],
  };
  for (const [nome, estraga] of Object.entries(estragosCC)) {
    const [c, t] = estraga(COMB, CAP);
    if (c === COMB && t === CAP) { falhas.push(`o estrago "${nome}" nao alterou nada (o teste de teste esta torto)`); continue; }
    if (conferir(t, ARMAS, REGRAS, c).length === 0) falhas.push(`o teste NÃO acusou o estrago "${nome}"`);
  }
  const R5 = copia(REGRAS); R5.combate.pgr.reforma.tiro.find((c) => c.id === 'arco-curto').preparo = 5;
  if (conferir(CAP, ARMAS, R5, COMB).length === 0) falhas.push('o teste NÃO acusou o Preparo do Arco Curto alterado em regras.json');
}

// ---- a ficha mostra a régua do LIVRO em TODAS as armas (rodada 4d)
// `linhaPGR` (ficha-engine.ts) mostra o que `anatomiaDaFicha` (ficha-pgr.ts) devolve. Aqui se percorrem as 40 armas do
// catálogo e se compara essa anatomia com a tabela "Preparo, Golpe e Recuperação" do capítulo Combate Físico. A coluna
// "qual linha da tabela é a de cada arma" é escrita à mão abaixo (a medição de 10/10/2026 do plano, rodada 4d), de
// propósito: se viesse de regras.json, a ficha e o teste leriam a mesma lista e concordariam errado.
const LINHA_DA_ARMA = {
  'Leve': ['adaga', 'espada-curta', 'machadinha', 'bastao', 'sabre'],
  'Média': ['espada-longa', 'machado', 'espada-serrilhada', 'maca', 'picareta-de-guerra', 'martelo', 'maca-estrela'],
  'Haste média': ['lanca'],
  'Haste de Guerra': ['alabarda', 'lanca-longa'],
  'Pesada': ['montante', 'martelo-de-guerra', 'machado-pesado'],
  'Punhos': ['desarmado'],
  'Arremesso leve': ['shuriken', 'mini-faca', 'kunai'],
  'Arremesso médio': ['adaga-de-arremesso', 'plumbata', 'bumerangue', 'bumerangue-de-retorno-cortante'],
  'Arremesso pesado': ['bumerangue-de-caca', 'bumerangue-de-caca-cortante', 'machado-de-arremesso', 'azagaia', 'pilum', 'boleadeira', 'rede'],
  'Funda': ['funda'],
  'Arco Curto': ['arco-curto'],
  'Arco Longo e Composto': ['arco-longo', 'arco-composto'],
  'Besta Pequena': ['besta-pequena'],
  'Besta Média': ['besta-media'],
  'Besta Grande': ['besta-grande'],
};
const MARCA_TABELA_PGR = '| Classe | Velocidade | Preparo | Golpe | Recuperação |';
async function carregarTS(rel) {
  const saida = path.join(os.tmpdir(), `${path.basename(rel, '.ts')}-capitulo-armas-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, rel)], outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error', define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  globalThis.__ENV__ = globalThis.__ENV__ || { BASE_URL: '/', MODE: 'test' };
  try { return await import(pathToFileURL(saida).href); } finally { try { fs.unlinkSync(saida); } catch { /* o sistema limpa */ } }
}
/** Percorre as armas e devolve o que a ficha mostra que difere da tabela do capítulo. `mostra(w)` devolve a anatomia. */
function conferirFicha(mostra, comb, armas) {
  const f = [];
  const tab = tabelaApos(comb, MARCA_TABELA_PGR);
  if (!tab) return ['Combate: falta a tabela "Preparo, Golpe e Recuperação"'];
  const vistas = new Set();
  for (const [nome, ids] of Object.entries(LINHA_DA_ARMA)) {
    const l = tab.linhas.find((r) => r[0] === nome);
    if (!l) { f.push(`ficha: a tabela do capítulo não tem a linha "${nome}"`); continue; }
    const [V, P, G, R] = l.slice(1).map(num);
    for (const id of ids) {
      vistas.add(id);
      const x = armas.find((y) => y.id === id);
      if (!x) { f.push(`ficha: "${id}" não existe no catálogo`); continue; }
      if (x.arma.ticks !== V) f.push(`ficha, ${id}: Velocidade ${x.arma.ticks} no catálogo, ${V} na linha "${nome}" do capítulo`);
      const a = mostra({ id: x.id, nome: x.nome, ...x.arma });
      const vem = [a.preparo, a.golpes, a.recuperacao, a.ciclo], deve = [P, G, R, V];
      if (JSON.stringify(vem) !== JSON.stringify(deve)) f.push(`ficha, ${id}: mostra P/G/R/ciclo ${vem.join('/')}, o capítulo (${nome}) diz ${deve.join('/')}`);
    }
  }
  for (const x of armas.filter((y) => y.arma)) if (!vistas.has(x.id)) f.push(`ficha: "${x.id}" está no catálogo e falta em LINHA_DA_ARMA`);
  return f;
}
{
  const catalogo = ARMAS.filter((x) => x.arma);
  if (catalogo.length !== 40) falhas.push(`ficha: o catálogo tem ${catalogo.length} armas, e o teste foi escrito para 40 (acrescente a nova em LINHA_DA_ARMA)`);
  const FP = await carregarTS('src/lib/ficha-pgr.ts');
  const CT = await carregarTS('src/lib/combate-tempo.ts');
  const dela = (R) => (w) => FP.anatomiaDaFicha(w, R);
  for (const x of conferirFicha(dela(REGRAS), COMB, catalogo)) falhas.push(x);
  // controle negativo 1: a ficha de ANTES da 4d (o tiro e o arremesso saíam da fórmula velha do motor) tem de ser acusada
  const velha = (w) => CT.anatomia({ classe: CT.classeDeTempo(w.id || w.nome, w.ticks), velocidade: w.ticks ?? 5, sistema: 'pgr' });
  const divVelha = conferirFicha(velha, COMB, catalogo).length;
  if (divVelha === 0) falhas.push('ficha: o teste NÃO acusou a régua velha do motor (o controle negativo deixou de ser negativo; se a passada do Grid alinhou o motor ao livro, troque o controle)');
  // controle negativo 2: a 4d sem a chave `tiro` de regras.json (a ficha cairia na fórmula velha do tiro)
  const R2 = copia(REGRAS); delete R2.combate.pgr.reforma.tiro;
  if (conferirFicha(dela(R2), COMB, catalogo).length === 0) falhas.push('ficha: o teste NÃO acusou a ficha sem combate.pgr.reforma.tiro');
  // controle negativo 3: uma célula da tabela do capítulo estragada (a recuperação do Arco Curto)
  const comb2 = COMB.replace('| Arco Curto | 6 | 4 | 1 | 1 |', '| Arco Curto | 6 | 5 | 1 | 0 |');
  if (comb2 === COMB || conferirFicha(dela(REGRAS), comb2, catalogo).length === 0) falhas.push('ficha: o teste NÃO acusou o Arco Curto estragado na tabela do capítulo');
  // o fallback por Velocidade de uma arma que não está no catálogo (id inventado, V6 de arremesso) segue a linha do livro
  const inv = FP.anatomiaDaFicha({ id: 'arma-inventada', nome: 'Arma inventada', ticks: 4, classe: 'arremesso' }, REGRAS);
  if (CT.classeDeTempo('arma-inventada', 4) === 'leve' && inv.ciclo !== 4) falhas.push('ficha: a arma sem catálogo devia cair na fórmula do motor (ciclo = Velocidade)');
}

// ---- o tempo da Arte: a Arte sai no Tick do Golpe, o penúltimo (D-084, rodada 4c)
// O que se prende: a tabela de Preparo, Golpe e Recuperação do capítulo (as três linhas da Arte, LINHA INTEIRA), o texto do
// capítulo Combate Físico, os textos de regras.json `arcano.tempoDaArte` e `arcano.esticar`, e a página As Artes (regras.astro).
// Os pinos de texto casam a linha toda ou a frase toda, e não um pedaço solto: um pedaço solto sobrevive num comentário ou numa
// frase velha ao lado da nova (o furo que a revisão 153 achou no linhaPGR da 4b e a 156 achou na 4d).
function conferirArte(comb, R, astro) {
  const f = [];
  const arte = R?.combate?.pgr?.reforma?.arte;
  const T = R?.arcano?.tempoDaArte;
  if (!arte || !T) return ['regras.json sem combate.pgr.reforma.arte ou arcano.tempoDaArte'];
  const tab = tabelaApos(comb, MARCA_TABELA_PGR);
  if (!tab) return ['Combate: falta a tabela "Preparo, Golpe e Recuperação"'];
  // 1. as três linhas da Arte, inteiras, e nenhuma linha velha de Arte
  const celulas = (c) => [c.nome, String(c.velocidade), String(c.preparo), String(c.golpe), String(c.recuperacao)];
  for (const c of arte.graus) {
    if (c.preparo !== c.velocidade - 1 - c.recuperacao || c.golpe !== 1 || c.recuperacao !== 1) f.push(`regras.json, ${c.nome}: Preparo = Velocidade − 1 − Recuperação, Golpe 1 e Recuperação 1 (D-082)`);
    const l = tab.linhas.find((r) => r[0] === c.nome);
    if (!l) { f.push(`Combate: falta a linha "${c.nome}" na tabela de Preparo, Golpe e Recuperação`); continue; }
    if (JSON.stringify(l) !== JSON.stringify(celulas(c))) f.push(`Combate, ${c.nome}: a linha é "${l.join(' | ')}", pelo dado devia ser "${celulas(c).join(' | ')}"`);
  }
  if (arte.graus.map((c) => c.velocidade).join() !== '5,6,7') f.push('regras.json: as Velocidades da Arte são 5, 6 e 7 por grau (D-082)');
  const velhas = tab.linhas.filter((r) => /^Arte/.test(r[0])).length;
  if (velhas !== arte.graus.length) f.push(`Combate: a tabela tem ${velhas} linhas de Arte, e o dado ${arte.graus.length} (sobrou a "Arte (conjuração) | 5 a 7")`);
  // 2. a regra do esticar em regras.json: n × V − 1, o exemplo da V5 e só o ciclo final leva Recuperação
  const est = arte.esticar;
  if (!est || est.tickDoGolpeDoCiclo !== 'n × V − 1' || est.soOCicloFinalLevaRecuperacao !== true) f.push('regras.json reforma.arte.esticar: faltam "n × V − 1" e "só o ciclo final leva Recuperação"');
  else if (JSON.stringify(est.exemploV5) !== JSON.stringify([1, 2, 3].map((n) => n * 5 - 1))) f.push(`regras.json reforma.arte.esticar: o exemplo da V5 devia ser 4, 9, 14 (n × 5 − 1), e é ${JSON.stringify(est.exemploV5)}`);
  // 3. o capítulo Combate Físico, frase por frase
  const linhasComb = comb.split('\n');
  const LINHA_60 = '| 5 a 7 (esticada: 10 em diante) | Arte | conjurar uma Arte: 5 a 7 Ticks, pela escada de As Artes; esticar a conjuração a leva a duas, três ou quatro vezes essa Velocidade (10, 15 e 20 na Velocidade 5) |';
  if (!linhasComb.includes(LINHA_60)) f.push('Combate: a linha da Arte na tabela de Velocidades devia ser a nova (esticar a duas, três ou quatro vezes a Velocidade), inteira');
  const pArte = linhasComb.find((l) => l.startsWith('A **Arte** tem a mesma forma'));
  if (!pArte) f.push('Combate: falta o parágrafo da Arte depois da tabela de Preparo, Golpe e Recuperação');
  else {
    for (const frase of ['Ela sai no **Tick do Golpe, o penúltimo da Velocidade** (a Velocidade menos um), e não no último', 'na Velocidade 5 o Preparo ocupa os Ticks 1 a 3, o Golpe é o Tick 4 e a Recuperação é o 5', 'na Velocidade 7, o Golpe é o Tick 6', 'de **4 a 6 Ticks**', 'A Recuperação da Arte cobra −2, como a de qualquer ataque']) {
      if (!pArte.includes(frase)) f.push(`Combate, parágrafo da Arte: falta "${frase}"`);
    }
  }
  const pNormal = linhasComb.find((l) => l.includes('A **Arte** é a exceção:'));
  if (!pNormal || !pNormal.includes('e a Arte rola e produz o efeito no Tick do Golpe, o penúltimo da Velocidade (ver O tempo da Arte, em As Artes).')) f.push('Combate, Normal: a Arte devia rolar e produzir o efeito no Tick do Golpe, o penúltimo da Velocidade');
  if (/no último Tick da Velocidade/.test(comb)) f.push('Combate: sobrou "no último Tick da Velocidade"');
  // 4. regras.json, arcano.tempoDaArte e o esticar
  const U = T.ultimoTick || {};
  const tem = (txt, frase, onde) => { if (!String(txt).includes(frase)) f.push(`${onde}: falta "${frase}"`); };
  const nao = (txt, re, onde) => { if (re.test(String(txt))) f.push(`${onde}: sobrou ${re}`); };
  tem(T.nota, 'a Arte resolve no TICK DO GOLPE, o penúltimo da ação.', 'tempoDaArte.nota');
  tem(U.regra, 'A ARTE resolve no TICK DO GOLPE, o penúltimo (a Velocidade menos um): uma conjuração de 7 Ticks acontece no sexto.', 'ultimoTick.regra');
  tem(U.regra, 'Na Velocidade 5 o Golpe é o Tick 4, na 6 é o 5 e na 7 é o 6', 'ultimoTick.regra');
  nao(U.regra, /sétimo|ÚLTIMO/, 'ultimoTick.regra');
  tem(U.porque, 'Como a Arte se anuncia por quatro a seis Ticks (o Preparo e o Golpe),', 'ultimoTick.porque');
  nao(U.porque, /se anuncia por cinco a sete/, 'ultimoTick.porque');
  if (!U.tabela || U.tabela[1]?.momento !== 'Tick do Golpe, quando sai') f.push('ultimoTick.tabela: o segundo momento devia ser "Tick do Golpe, quando sai"');
  tem(U.resumo, 'no Tick do Golpe se dá a forma e a mira', 'ultimoTick.resumo');
  nao(U.resumo, /sete Ticks antes|no último Tick/, 'ultimoTick.resumo');
  tem(T.identificar?.teste, 'no Tick do Golpe é uma bola de fogo pronta na mão.', 'identificar.teste');
  tem(T.area?.deslocamentoLivre?.semGabarito, 'só travam no Tick do Golpe, durante o Preparo', 'semGabarito');
  nao(T.area?.deslocamentoLivre?.semGabarito, /sete Ticks|último Tick/, 'semGabarito');
  const DT = R?.arcano?.esticar?.decisaoTardia ?? R?.arcano?.decisaoTardia ?? Object.values(R?.arcano || {}).map((x) => x?.decisaoTardia).find(Boolean);
  if (!DT) f.push('regras.json: não achei a decisaoTardia');
  else {
    tem(DT, 'No Tick do Golpe de cada ciclo ele escolhe', 'decisaoTardia');
    tem(DT, 'O Golpe do ciclo n cai no Tick n × V − 1', 'decisaoTardia');
    tem(DT, 'uma ação de Velocidade 5 decide no Tick 4; se esticar, decide de novo no 9, e assim por diante (14, 19).', 'decisaoTardia');
    tem(DT, 'Só o ciclo final leva Recuperação.', 'decisaoTardia');
    tem(DT, 'O Tick em que se decide esticar ainda é Preparo (−2 na Defesa), e só o Tick em que a Arte sai é Golpe (−4).', 'decisaoTardia');
    nao(DT, /tick final|no 10/, 'decisaoTardia');
  }
  const FTN = Object.values(R?.arcano || {}).map((x) => x?.feiticoTicksNota).find(Boolean) ?? R?.arcano?.feiticoTicksNota;
  if (!FTN) f.push('regras.json: não achei a feiticoTicksNota');
  else { tem(FTN, 'a Arte resolve no Tick do Golpe, o penúltimo, ao contrário da ação comum', 'feiticoTicksNota'); nao(FTN, /ÚLTIMO/, 'feiticoTicksNota'); }
  // 5. a página As Artes (regras.astro), linha inteira
  const la = astro.split('\n');
  if (!la.some((l) => /^\s*<div class="callout regra"><span class="lbl">A Arte sai no Tick do Golpe<\/span>$/.test(l))) f.push('regras.astro: o rótulo do callout devia ser "A Arte sai no Tick do Golpe" (linha inteira)');
  const modos = la.find((l) => l.includes('<span class="lbl">Os dois modos</span>'));
  if (!modos || !modos.includes('e a Arte sai no <a href="#tempo"><strong>Tick do Golpe, o penúltimo</strong></a>, ao contrário da ação comum, que resolve no primeiro.')) f.push('regras.astro, Os dois modos: a Arte devia sair no Tick do Golpe, o penúltimo');
  const dec = la.find((l) => /^\s*Não é preciso anunciar de saída até onde vai\./.test(l));
  if (!dec) f.push('regras.astro: falta o callout "Você decide no fim"');
  else for (const frase of ['No <strong>Tick do Golpe de cada ciclo</strong> você escolhe', 'O Golpe do ciclo n cai no Tick <strong>n × V − 1</strong>', 'numa ação de Velocidade 5, você decide no Tick 4; se esticar, decide de novo no 9, e outra vez no 14.', 'Só o ciclo final leva Recuperação, e o sinal esticado dura T − 1 Ticks']) {
    if (!dec.includes(frase)) f.push(`regras.astro, esticar: falta "${frase}"`);
  }
  if (!la.some((l) => /^\s*<p class="muted">O Tick em que você decide esticar ainda é Preparo \(−2 na Defesa\), e só o Tick em que a Arte sai é Golpe \(−4\)\. Quem segura no Tick 4 da Velocidade 5 não tem Recuperação no 5: esse Tick já é Preparo do ciclo seguinte\.<\/p>$/.test(l))) f.push('regras.astro: falta a frase separada do Tick de decisão (Preparo, −2), inteira');
  nao(astro, /tick final de cada Velocidade|<strong>último<\/strong>|A Arte sai no último Tick/, 'regras.astro');
  return f;
}
{
  const ASTRO = ler('src/pages/artes/regras.astro').replace(/\r\n/g, '\n');
  const realArte = conferirArte(COMB, REGRAS, ASTRO);
  for (const x of realArte) falhas.push(x);
  const mut = realArte.length ? {} : {
    'a linha da Arte graus 0 a 3 no capítulo': (c, r, a) => [c.replace('| Arte, graus 0 a 3 | 5 | 3 | 1 | 1 |', '| Arte, graus 0 a 3 | 5 | 3 | 1 | 0 |'), r, a],
    'a linha velha da Arte de volta no capítulo': (c, r, a) => [c.replace('| Arte, grau 4 | 6 | 4 | 1 | 1 |', '| Arte, grau 4 | 6 | 4 | 1 | 1 |\n| Arte (conjuração) | 5 a 7 | Velocidade − 1 | 1 | 0 |'), r, a],
    'o penúltimo no parágrafo da Arte': (c, r, a) => [c.replace('Ela sai no **Tick do Golpe, o penúltimo da Velocidade**', 'Ela sai no **último Tick da Velocidade**'), r, a],
    '4 a 6 Ticks de aviso': (c, r, a) => [c.replace('de **4 a 6 Ticks**', 'de **5 a 7 Ticks**'), r, a],
    'a Arte no último Tick, no Normal': (c, r, a) => [c.replace('produz o efeito no Tick do Golpe, o penúltimo da Velocidade (ver', 'produz o efeito no último Tick da Velocidade (ver'), r, a],
    'a linha 60 do capítulo (10, 15, 20 e adiante)': (c, r, a) => [c.replace('a leva a duas, três ou quatro vezes essa Velocidade (10, 15 e 20 na Velocidade 5)', 'a leva a 10, 15, 20 e adiante'), r, a],
    'o sétimo em regras.json': (c, r, a) => [c, edita(r, (x) => { x.arcano.tempoDaArte.ultimoTick.regra = x.arcano.tempoDaArte.ultimoTick.regra.replace('acontece no sexto', 'acontece no sétimo'); }), a],
    'o "cinco a sete Ticks" do sinal em regras.json': (c, r, a) => [c, edita(r, (x) => { x.arcano.tempoDaArte.ultimoTick.porque = x.arcano.tempoDaArte.ultimoTick.porque.replace('quatro a seis Ticks (o Preparo e o Golpe)', 'cinco a sete Ticks'); }), a],
    'a tabela "Último Tick, quando sai" de volta': (c, r, a) => [c, edita(r, (x) => { x.arcano.tempoDaArte.ultimoTick.tabela[1].momento = 'Último Tick, quando sai'; }), a],
    'o "último" do identificar.teste': (c, r, a) => [c, edita(r, (x) => { x.arcano.tempoDaArte.identificar.teste = x.arcano.tempoDaArte.identificar.teste.replace('no Tick do Golpe é uma bola', 'no último é uma bola'); }), a],
    'os "sete Ticks" do semGabarito': (c, r, a) => [c, edita(r, (x) => { const d = x.arcano.tempoDaArte.area.deslocamentoLivre; d.semGabarito = d.semGabarito.replace('durante o Preparo:', 'durante os sete Ticks:'); }), a],
    'o 10 no lugar do 9 na decisaoTardia': (c, r, a) => [c, edita(r, (x) => { const k = Object.values(x.arcano).find((y) => y?.decisaoTardia); k.decisaoTardia = k.decisaoTardia.replace('decide de novo no 9', 'decide de novo no 10'); }), a],
    'sem "Só o ciclo final leva Recuperação" na decisaoTardia': (c, r, a) => [c, edita(r, (x) => { const k = Object.values(x.arcano).find((y) => y?.decisaoTardia); k.decisaoTardia = k.decisaoTardia.replace('Só o ciclo final leva Recuperação. ', ''); }), a],
    'o exemplo da V5 estragado em reforma.arte.esticar': (c, r, a) => [c, edita(r, (x) => { x.combate.pgr.reforma.arte.esticar.exemploV5 = [5, 10, 15]; }), a],
    'a feiticoTicksNota com ÚLTIMO': (c, r, a) => [c, edita(r, (x) => { x.arcano.feiticoTicksNota = String(x.arcano.feiticoTicksNota).replace('Tick do Golpe, o penúltimo', 'ÚLTIMO'); }), a],
    'o rótulo do callout da página': (c, r, a) => [c, r, a.replace('<span class="lbl">A Arte sai no Tick do Golpe</span>', '<span class="lbl">A Arte sai no último Tick</span>')],
    'Os dois modos na página': (c, r, a) => [c, r, a.replace('<strong>Tick do Golpe, o penúltimo</strong></a>', '<strong>último</strong></a>')],
    'o esticar na página (tick 5, 10, 15)': (c, r, a) => [c, r, a.replace('você decide no Tick 4; se esticar, decide de novo no 9, e outra vez no 14.', 'você decide no tick 5; se esticar, decide de novo no 10, e outra vez no 15.')],
    'a frase do Tick de decisão sumida da página': (c, r, a) => [c, r, a.replace(/ *<p class="muted">O Tick em que você decide esticar[^\n]*\n/, '')],
    'a frase velha ao lado da nova na página': (c, r, a) => [c, r, a + '\n<p>No tick final de cada Velocidade você escolhe.</p>\n'],
  };
  const edita = (r, fn) => { const x = copia(r); fn(x); return x; };
  for (const [nome, estraga] of Object.entries(mut)) {
    const [c, r, a] = estraga(COMB, REGRAS, ASTRO);
    if (c === COMB && JSON.stringify(r) === JSON.stringify(REGRAS) && a === ASTRO) { falhas.push(`o estrago "${nome}" não alterou nada (o teste de teste está torto)`); continue; }
    if (conferirArte(c, r, a).length === 0) falhas.push(`o teste NÃO acusou o estrago da Arte "${nome}"`);
  }
  TOTAL_ARTE = Object.keys(mut).length;
}

// ---- a Defesa sem teto de penalidades, o piso 0, a Defesa zerada, o cego e a restrição de corpo e de lugar (rodada 5)
// D-078, D-079, D-081 (só as duas linhas da tabela) e D-086. Os pinos casam a LINHA inteira (as linhas das tabelas, a frase
// da regra), e a ausência do que saiu: um pedaço solto sobrevive numa frase velha ao lado da nova.
function conferirDefesa(comb, cap, sent, R, mesa = '', ref = '') {
  const f = [];
  const L = comb.split('\n'), LA = cap.split('\n'), LS = sent.split('\n');
  const linha = (ls, exata, onde) => { if (!ls.includes(exata)) f.push(`${onde}: falta a linha "${exata.slice(0, 90)}"`); };
  const comeca = (ls, ini, frases, onde) => {
    const l = ls.find((x) => x.startsWith(ini));
    if (!l) { f.push(`${onde}: falta a linha que começa com "${ini.slice(0, 60)}"`); return; }
    for (const fr of frases) if (!l.includes(fr)) f.push(`${onde}: a linha "${ini.slice(0, 40)}" não tem "${fr.slice(0, 80)}"`);
  };
  // a Defesa zerada e o cego
  for (const l of ['| **Surpreso** (não sabe do ataque) | 0 | 0 |', '| **Totalmente imobilizado** (amarrado, soterrado) | 0 | 0 |', '| **Dormindo** ou **desacordado** | 0 | 0 |', '| **Cego, vendado ou no escuro total**, sabendo que vai ser atacado | −4 | −8 |']) linha(L, l, 'Combate, Defesa zerada');
  comeca(L, 'Sempre que o personagem **não souber do ataque**', ['a Defesa correspondente é **zerada**: basta um total de 1 para acertar.', 'Um ataque **imbloqueável** zera só o Bloqueio, um **inesquivável** zera só a Esquiva, e os dois juntos zeram tudo.', 'Quem se mexe e **vê o ataque** tem a Defesa normal.'], 'Combate, Defesa zerada');
  comeca(L, 'Cego sem saber do ataque vale como surpreso.', ['A penumbra fica sem regra, a critério do Mestre.', 'o atacante rola **Furtividade** contra a **Percepção Passiva** do defendido', 'o atacante invisível usa o mesmo teste.'], 'Combate, Defesa zerada');
  // a tabela de restrição (as sete linhas) e as duas frases que a cercam
  for (const l of ['| **Corpo, leve** | pé enroscado, lama funda | −2 | 0 |', '| **Corpo, parcial nas pernas** | uma perna presa; Preso por boleadeira ou por Arte de prender | −4 | 0 |', '| **Corpo, parcial nos braços** | um braço preso, arma travada | 0 | −4 |', '| **Corpo, grave** | preso pela cintura; Agarrado (só contra quem está de fora) | −8 | −4 |', '| **Corpo, total** | amarrado, soterrado; Imobilizado | zerada | zerado |', '| **Lugar: pouco espaço** | corredor estreito, entre galhos, túnel | −2 | −4 |', '| **Lugar: sem equilíbrio** | corda bamba, telhado inclinado, convés no temporal | −4 | −2 |']) linha(L, l, 'Combate, restrição');
  if (L.some((x) => /rede nas pernas|enrolado na rede/i.test(x) && x.startsWith('|'))) f.push('Combate, restrição: "rede nas pernas" e "enrolado na rede" saem da tabela (a Rede tem regra própria)');
  comeca(L, 'No Total, as Defesas zeradas são a Esquiva e o Bloqueio', ['e **não** a Defesa de agarrão.', 'o escudo **perde o bônus**: ele não está *apto*', '**Alguns estados se substituem em vez de se somar**', 'Prono (Caído)'], 'Combate, restrição');
  // o teto: bônus +6, penalidade sem teto, piso 0
  comeca(L, '<p class="muted">A <strong>postura agressiva</strong>', ['**se somam todos na mesma Defesa**', '**Os bônus têm teto, as penalidades não:**', 'somam no máximo <strong>+6</strong>, e as penalidades <strong>não têm teto nenhum</strong>.', 'O piso é um só: a Defesa <strong>nunca fica abaixo de 0</strong>.</p>'], 'Combate, teto');
  if (L.some((x) => /limitado a <strong>±6/.test(x))) f.push('Combate: sobrou o empilhamento "limitado a ±6"');
  comeca(L, 'A Defesa é um valor **fixo** e **passivo**', ['e ela **nunca fica abaixo de 0**.', 'fica com a Defesa correspondente **zerada** (ver *Vantagem tática*).'], 'Combate, A Defesa é um valor fixo');
  comeca(L, 'Acertar não é tudo ou nada:', ['Contra uma Defesa zerada a Margem **não tem teto**'], 'Combate, Margem');
  linha(L, '- **Defesa reflexiva** de Proeza (Aparar, Reflexos de Vento, Voz Calma, +3) conta para o **teto de +6** dos bônus de Defesa: não empilha além disso com cobertura e postura defensiva.', 'Combate, Defesa reflexiva');
  // saíram da tabela de situações, e do Correndo
  if (/Alvo surpreso, cego ou imobilizado|Alvo agarrado, atacado por quem não o agarra/.test(comb)) f.push('Combate: sobrou na tabela de situações a linha de surpreso/cego/imobilizado ou a do agarrado a −2 (agora na Defesa zerada e na restrição)');
  comeca(L, 'É o mesmo −4 do Tick do Golpe,', ['e ele diz uma coisa'], 'Combate, Correndo');
  if (/condições surpreso, cego e imobilizado/.test(comb)) f.push('Combate, Correndo: sobrou "das condições surpreso, cego e imobilizado"');
  if (!comb.includes('é o *pouco espaço* da tabela de restrição, em que o escudo perde o bônus')) f.push('Combate, escudo apto: falta a ligação com o pouco espaço da tabela de restrição');
  // o "teto de ±6" não resta em lugar nenhum de combate.md (o porte, que ainda o citava, foi reescrito na rodada 6)
  if (L.some((x) => x.includes('teto de ±6'))) f.push('Combate: sobrou "teto de ±6"');
  linha(LA, '- **Alcance**: ataca a 1 m de distância (uma casa); **+2 no acerto** contra quem se aproxima, **−2** contra quem já está colado. É bônus de acerto de quem ataca, e não modificador de Defesa: não entra no teto de +6 dos bônus de Defesa.', 'Armas & Armaduras, Alcance');
  if (cap.includes('teto de ±6')) f.push('Armas & Armaduras: sobrou "teto de ±6"');
  comeca(LS, '**Antes de um ataque** ·', ['é o que separa o alvo surpreso, de Defesa zerada, do que se defende', 'Quem ataca rola **Furtividade**, como no Esgueirar-se, contra a **Percepção Passiva** do defendido.', 'Falhou: ele sabe, e se defende normalmente. O atacante invisível usa o mesmo teste.'], 'Ações, Sentidos e Engano');
  // a parte presa conta: a frase que abre a tabela de restrição
  comeca(L, 'Para o Mestre. O corpo preso ou o lugar apertado tiram da Esquiva e do Bloqueio', ['**só a parte presa conta**: quem tem uma perna presa perde Esquiva e conserva o Bloqueio dos braços.'], 'Combate, restrição');
  // os espelhos em dado das frases do capítulo (rodada 5-bis): o Correndo e a faixa de distância
  const CO = R?.combate?.movimento?.corrida?.texto;
  if (!CO || !CO.includes('que é o mesmo −4 do Tick do Golpe. Correndo não se apara nem se esquiva.')) f.push('regras.json movimento.corrida.texto: devia dizer "que é o mesmo −4 do Tick do Golpe." como o capítulo');
  const OE = R?.combate?.alcance?.faixas?.ondeEntra;
  if (!OE || !OE.includes('Por isso não é modificador de Defesa e não entra no teto de +6 dos bônus de Defesa.')) f.push('regras.json alcance.faixas.ondeEntra: devia dizer que não entra no teto de +6 dos bônus de Defesa');
  // varredura: nenhum texto de regras.json fala do teto velho nem das condições surpreso/cego/imobilizado a -4, salvo as exceções abaixo
  const EXCECOES_TETO = {
    'derivados.defesaSocial.reguaNota': 'a régua social tem o próprio ±6, que é outro assunto',
  };
  const varre = (o, caminho) => {
    for (const [k, v] of Object.entries(o || {})) {
      const c = caminho ? `${caminho}.${k}` : k;
      if (typeof v === 'string') { if (/±\s?6|\+\s?\/\s?[-−]\s?6|\+\s?[-−]\s?6|de [-−]6 a \+6|condições surpreso/.test(v) && !(c in EXCECOES_TETO)) f.push(`regras.json ${c}: fala do teto velho (±6) ou das "condições surpreso, cego e imobilizado"; só valem as exceções listadas no teste`); }
      else if (v && typeof v === 'object') varre(v, c);
    }
  };
  varre(R, '');
  // a referência da mesa (rodada 5-ter): combateTatico diz o que o livro diz
  const CT = R?.combateTatico;
  if (!CT) f.push('regras.json: não achei combateTatico');
  else {
    if ('modificadorCap' in CT) f.push('combateTatico: sobrou modificadorCap (o teto de ±6 não existe mais)');
    if (CT.bonusCap !== 6 || CT.penalidadeCap !== null || CT.pisoDefesa !== 0) f.push('combateTatico: bonusCap 6, penalidadeCap null e pisoDefesa 0 (D-078)');
    if ((CT.modificadores || []).some((m) => /surpreso|cego|imobilizado|agarrad/i.test(m.nome))) f.push('combateTatico.modificadores: sobrou a linha de surpreso, cego, imobilizado ou agarrado a -4 ou -2 (agora em defesaZerada e na restrição do capítulo)');
    const Z = (CT.defesaZerada?.linhas || []).map((l) => JSON.stringify(l));
    for (const esp of [{ nome: 'Surpreso (não sabe do ataque)', tipo: 'zera' }, { nome: 'Totalmente imobilizado (amarrado, soterrado)', tipo: 'zera' }, { nome: 'Dormindo ou desacordado', tipo: 'zera' }, { nome: 'Cego, vendado ou no escuro total, sabendo do ataque', tipo: 'soma', esquiva: -4, bloqueio: -8 }]) {
      if (!Z.includes(JSON.stringify(esp))) f.push(`combateTatico.defesaZerada: falta a linha ${JSON.stringify(esp)}`);
    }
  }
  const lm = mesa.split('\n'), lr = ref.split('\n');
  const paginaPina = (ls, ini, frases, onde) => {
    const l = ls.find((x) => x.trimStart().startsWith(ini));
    if (!l) { f.push(`${onde}: falta a linha que começa com "${ini.slice(0, 50)}"`); return; }
    for (const fr of frases) if (!l.includes(fr)) f.push(`${onde}: a linha "${ini.slice(0, 40)}" não tem "${fr.slice(0, 70)}"`);
  };
  if (mesa) {
    paginaPina(lm, '<p class="muted nota-mini">Os <strong>bônus</strong> de Defesa vão até', ['<strong>+{(regras.combateTatico as any).bonusCap}</strong>', '<strong>penalidades não têm teto</strong>', '<strong>nunca fica abaixo de 0</strong>', 'O porte entra no <em>acerto</em>, sem teto: <strong>+{(regras.porteAcerto as any).reforma.porCategoria} por categoria</strong>, e no corpo a corpo só o menor ganha.</p>'], 'mesa.astro');
    if (/modificadorCap|Teto de <strong>±|somando tudo/.test(mesa)) f.push('mesa.astro: sobrou o teto de ±6 somando tudo ou modificadorCap');
  }
  if (ref) {
    paginaPina(lr, '<p class="ref-nota">{CT.nota} Os <strong>bônus</strong> de Defesa vão até', ['<strong>+{CT.bonusCap}</strong>', '<strong>penalidades não têm teto</strong>', '<strong>nunca fica abaixo de 0</strong>.</p>'], 'referencia.astro');
    if (/modificadorCap|Teto de <strong>±|somando tudo/.test(ref)) f.push('referencia.astro: sobrou o teto de ±6 somando tudo ou modificadorCap');
    if (!lr.some((x) => x.includes('<h3>Defesa zerada e cego</h3>'))) f.push('referencia.astro: falta a tabela "Defesa zerada e cego"');
  }
  const DR = R?.empilhamentoProezas?.defesaReflexiva;
  if (!DR) f.push('regras.json: não achei empilhamentoProezas.defesaReflexiva');
  else {
    for (const fr of ['contam para o TETO de +6 dos BÔNUS de Defesa', 'As PENALIDADES de Defesa não têm teto (D-078)', 'a exceção que a tirava do teto ficou sem objeto.']) if (!DR.includes(fr)) f.push(`regras.json defesaReflexiva: falta "${fr}"`);
    if (/±6|FORA do teto/.test(DR)) f.push('regras.json defesaReflexiva: sobrou "±6" ou "FORA do teto"');
  }
  return f;
}
{
  const SENT = ler('src/content/chapters/acoes-sentidos-e-engano.md').replace(/\r\n/g, '\n');
  const MESA = ler('src/pages/mesa.astro').replace(/\r\n/g, '\n'), REF = ler('src/pages/mesa/referencia.astro').replace(/\r\n/g, '\n');
  const realDef = conferirDefesa(COMB, CAP, SENT, REGRAS, MESA, REF);
  for (const x of realDef) falhas.push(x);
  const edita2 = (r, fn) => { const x = copia(r); fn(x); return x; };
  const mutD = realDef.length ? {} : {
    'Surpreso com Defesa 0': (c, a, t, r) => [c.replace('| **Surpreso** (não sabe do ataque) | 0 | 0 |', '| **Surpreso** (não sabe do ataque) | −4 | −4 |'), a, t, r],
    'o cego com −4/−8': (c, a, t, r) => [c.replace('sabendo que vai ser atacado | −4 | −8 |', 'sabendo que vai ser atacado | −4 | −4 |'), a, t, r],
    'o dormindo sumido': (c, a, t, r) => [c.replace('| **Dormindo** ou **desacordado** | 0 | 0 |\n', ''), a, t, r],
    'o imbloqueável': (c, a, t, r) => [c.replace('Um ataque **imbloqueável** zera só o Bloqueio', 'Um ataque **imbloqueável** zera só a Esquiva'), a, t, r],
    'a linha do Agarrado a −2': (c, a, t, r) => [c.replace('| **Corpo, grave** | preso pela cintura; Agarrado (só contra quem está de fora) | −8 | −4 |', '| **Corpo, grave** | preso pela cintura; Agarrado | −2 | −2 |'), a, t, r],
    'o Imobilizado a −4': (c, a, t, r) => [c.replace('amarrado, soterrado; Imobilizado | zerada | zerado |', 'amarrado, soterrado; Imobilizado | −4 | −4 |'), a, t, r],
    'o pouco espaço': (c, a, t, r) => [c.replace('entre galhos, túnel | −2 | −4 |', 'entre galhos, túnel | −4 | −2 |'), a, t, r],
    'a rede nas pernas na tabela': (c, a, t, r) => [c.replace('| **Corpo, leve** | pé enroscado, lama funda | −2 | 0 |', '| **Corpo, leve** | pé enroscado, lama funda, rede nas pernas | −2 | 0 |'), a, t, r],
    'o modificadorCap de volta': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combateTatico.modificadorCap = 6; }), m, rf],
    'a linha do surpreso a -4 de volta': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combateTatico.modificadores.push({ nome: 'Surpreso, cego ou imobilizado', valor: -4, alvo: 'defesa', nota: 'x' }); }), m, rf],
    'o cego com -4/-4 em combateTatico': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combateTatico.defesaZerada.linhas[3].bloqueio = -4; }), m, rf],
    'o teto de penalidade em combateTatico': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combateTatico.penalidadeCap = 6; }), m, rf],
    'o teto de ±6 somando tudo na mesa': (c, a, t, r, m, rf) => [c, a, t, r, m.replace('<strong>nunca fica abaixo de 0</strong>. O porte', '<strong>nunca fica abaixo de 0</strong>. Teto de <strong>±6</strong> somando tudo. O porte'), rf],
    'o teto de ±6 somando tudo na referência': (c, a, t, r, m, rf) => [c, a, t, r, m, rf.replace('<strong>+{CT.bonusCap}</strong>', 'Teto de <strong>±{CT.modificadorCap}</strong> somando tudo')],
    'um "de −6 a +6" novo em regras.json': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combate.movimento.corrida.nota = 'a Defesa vai de −6 a +6'; }), m, rf],
    'um "± 6" com espaço em regras.json': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combate.movimento.corrida.nota = 'teto de ± 6'; }), m, rf],
    'um "+/−6" com o menos U+2212 em regras.json': (c, a, t, r, m, rf) => [c, a, t, edita2(r, (x) => { x.combate.movimento.corrida.nota = 'teto de +/−6'; }), m, rf],
    'a parte presa conta sumida': (c, a, t, r) => [c.replace('**só a parte presa conta**: quem tem uma perna presa perde Esquiva e conserva o Bloqueio dos braços.', 'a restrição vale no corpo inteiro.'), a, t, r],
    'o Correndo em regras.json com as condições': (c, a, t, r) => [c, a, t, edita2(r, (x) => { x.combate.movimento.corrida.texto = x.combate.movimento.corrida.texto.replace('do Tick do Golpe.', 'do Tick do Golpe e das condições surpreso, cego e imobilizado.'); })],
    'a faixa de distância com o teto velho': (c, a, t, r) => [c, a, t, edita2(r, (x) => { x.combate.alcance.faixas.ondeEntra = x.combate.alcance.faixas.ondeEntra.replace('não entra no teto de +6 dos bônus de Defesa.', 'não respeita o teto de +/-6 dos modificadores de Defesa.'); })],
    'um ±6 novo em outra chave de regras.json': (c, a, t, r) => [c, a, t, edita2(r, (x) => { x.combate.movimento.corrida.nota = 'o teto de ±6 da Defesa'; })],
    'a frase da D-086': (c, a, t, r) => [c.replace('**Alguns estados se substituem em vez de se somar**', 'Alguns estados se somam'), a, t, r],
    'o teto de ±6 de volta': (c, a, t, r) => [c.replace('somam no máximo <strong>+6</strong>, e as penalidades <strong>não têm teto nenhum</strong>.', 'somam no máximo <strong>±6</strong>.'), a, t, r],
    'o piso 0 sumido': (c, a, t, r) => [c.replace('O piso é um só: a Defesa <strong>nunca fica abaixo de 0</strong>.', 'Sem piso.'), a, t, r],
    'a Margem com teto': (c, a, t, r) => [c.replace('a Margem **não tem teto**', 'a Margem tem teto'), a, t, r],
    'a linha do surpreso de volta na tabela de situações': (c, a, t, r) => [c.replace('| Flanco ou pelas costas | **−2** |', '| Flanco ou pelas costas | **−2** |\n| Alvo surpreso, cego ou imobilizado (Imobilizado: ver Manobras) | **−4** |'), a, t, r],
    'o Correndo com as condições': (c, a, t, r) => [c.replace('É o mesmo −4 do Tick do Golpe, e ele', 'É o mesmo −4 do Tick do Golpe e das condições surpreso, cego e imobilizado, e ele'), a, t, r],
    'a defesa reflexiva com ±6': (c, a, t, r) => [c.replace('conta para o **teto de +6** dos bônus de Defesa', 'conta para o **teto de ±6** dos modificadores situacionais'), a, t, r],
    'o ±6 do Alcance de volta': (c, a, t, r) => [c, a.replace('não entra no teto de +6 dos bônus de Defesa.', 'e não entra no teto de ±6 da Defesa.'), t, r],
    'a Furtividade em Ações': (c, a, t, r) => [c, a, t.replace('contra a **Percepção Passiva** do defendido. Passou', 'contra a Dificuldade. Passou'), r],
    'o invisível em Ações': (c, a, t, r) => [c, a, t.replace('O atacante invisível usa o mesmo teste.', ''), r],
    'a exceção da Proeza de volta em regras.json': (c, a, t, r) => [c, a, t, edita2(r, (x) => { x.empilhamentoProezas.defesaReflexiva += ' Exceção: penalidade IMPOSTA por Proeza fica FORA do teto.'; })],
    'o teto de ±6 em regras.json': (c, a, t, r) => [c, a, t, edita2(r, (x) => { x.empilhamentoProezas.defesaReflexiva = x.empilhamentoProezas.defesaReflexiva.replace('TETO de +6 dos BÔNUS de Defesa', 'TETO de ±6 dos modificadores'); })],
  };
  for (const [nome, estraga] of Object.entries(mutD)) {
    const [c, a, t, r, m = MESA, rf = REF] = estraga(COMB, CAP, SENT, REGRAS, MESA, REF);
    if (c === COMB && a === CAP && t === SENT && JSON.stringify(r) === JSON.stringify(REGRAS) && m === MESA && rf === REF) { falhas.push(`o estrago "${nome}" não alterou nada (o teste de teste está torto)`); continue; }
    if (conferirDefesa(c, a, t, r, m, rf).length === 0) falhas.push(`o teste NÃO acusou o estrago da Defesa "${nome}"`);
  }
  TOTAL_ARTE += Object.keys(mutD).length;
}

// ---- o Porte: +3 por categoria sem teto, só o menor ganha no corpo a corpo, relativo à distância (rodada 6, D-077)
// Pinos pela LINHA inteira e pela AUSÊNCIA do que saiu (o "+12 (teto)", o "Simétrico", o "até 4 categorias", o "teto de ±6").
function conferirPorte(comb, R, gloss, ref, mesa) {
  const f = [];
  const L = comb.split('\n');
  const linha = (exata, onde) => { if (!L.includes(exata)) f.push(`${onde}: falta a linha "${exata.slice(0, 100)}"`); };
  const comeca = (ini, frases, onde) => {
    const l = L.find((x) => x.startsWith(ini));
    if (!l) { f.push(`${onde}: falta a linha que começa com "${ini.slice(0, 60)}"`); return; }
    for (const fr of frases) if (!l.includes(fr)) f.push(`${onde}: a linha "${ini.slice(0, 40)}" não tem "${fr.slice(0, 80)}"`);
  };
  comeca('O tamanho conta na **jogada de acerto** dos **ataques físicos**:', ['soma **+3**, **sem teto**.'], 'Combate, Porte');
  comeca('- **Corpo a corpo: só o menor ganha.**', ['Quem é menor que o alvo soma **+3 por categoria** de diferença contra ele.', 'Quem é igual ou maior ataca **sem penalidade** e sem bônus.', 'as criaturas grandes devem ser temidas pelas menores.'], 'Combate, Porte, corpo a corpo');
  comeca('- **À distância, relativo nos dois sentidos.**', ['(arremesso, projétil, arco, besta, ataque mágico e Artes físicas à distância)', 'alvo **maior** que quem ataca, **+3 por categoria**; alvo **menor**, **−3 por categoria**.'], 'Combate, Porte, à distância');
  for (const l of ['| **Maior** em *n* categorias | **+3 × n** | **+3 × n** |', '| **Do mesmo porte** | 0 | 0 |', '| **Menor** em *n* categorias | **0** | **−3 × n** |']) linha(l, 'Combate, Porte, tabela');
  comeca('Sem teto quer dizer sem teto:', ['um Miúdo que ataca um Colossal soma **+18**, de perto ou de longe.', 'rola sem penalidade', '**−18**'], 'Combate, Porte, exemplo');
  comeca('Atirar num Colossal **muito longe** continua difícil:', ['o porte não escala a Efetiva', 'entra só como bônus fixo no acerto.', 'Um **enxame** usa o tamanho que **apresenta**, nos dois papéis, como alvo e como atacante.'], 'Combate, Porte, Colossal e enxame');
  comeca('Isso é **só no acerto**:', ['não é modificador de Defesa (então fica fora do teto de +6 dos bônus de Defesa)', 'ataques **Sociais** ou **Mentais**, nem a Artes de **área** sem rolagem de ataque.', 'a **Couraça de Porte**'], 'Combate, Porte, exclusões');
  linha('<div class="callout regra"><span class="lbl">Nota ao Mestre</span>Criaturas maiores que Médio que lutam <strong>entre si</strong> não ganham bônus de Defesa pelo tamanho. Nesses casos o Mestre pode aumentar a Defesa delas.</div>', 'Combate, Porte, nota ao Mestre');
  comeca('Controlar alguém em vez de feri-lo é uma **Manobra**', ['O porte conta no acerto como em qualquer ataque de corpo a corpo: só o menor ganha bônus contra o maior (ver *Porte*).'], 'Combate, Manobras');
  if (/\+12\*\* \(teto\)|\*\*Simétrico:\*\*|até 4 categorias|\| Alvo \*\*\d\*\* categorias? maiores?/.test(comb)) f.push('Combate: sobrou o teto de 4 categorias, o "+12 (teto)" ou o "Simétrico" do porte velho');
  // regras.json: porteAcerto
  const PA = R?.porteAcerto;
  if (!PA?.reforma) f.push('regras.json: falta porteAcerto.reforma');
  else {
    if (PA.reforma.porCategoria !== 3 || PA.reforma.teto !== null) f.push('porteAcerto.reforma: porCategoria 3 e teto null (D-077)');
    for (const k of ['corpoACorpo', 'aDistancia', 'enxame', 'fora', 'efetiva']) if (!PA.reforma[k]) f.push(`porteAcerto.reforma: falta ${k}`);
    if (!/só o menor ganha/.test(PA.reforma.corpoACorpo) || !/relativo nos dois sentidos/.test(PA.reforma.aDistancia)) f.push('porteAcerto.reforma: corpo a corpo só o menor ganha, à distância relativo');
    // o Grid lê ordem, porDiferenca e capCategorias, e esses ficam como estão
    if (PA.capCategorias !== 4 || JSON.stringify(PA.porDiferenca) !== JSON.stringify([0, 3, 6, 9, 12])) f.push('porteAcerto: capCategorias 4 e porDiferenca [0,3,6,9,12] são o que o Grid lê (calc.ts) e não mudam nesta rodada');
    if (!PA.gridNota || !/Grid lê/.test(PA.gridNota)) f.push('porteAcerto.gridNota: falta a nota de que o Grid ainda lê a regra velha');
    for (const fr of ['+3 por categoria, SEM TETO (D-077)', 'CORPO A CORPO: só o menor ganha (+3 por categoria contra o maior); o maior ataca o menor sem penalidade.', 'À DISTÂNCIA (arremesso, projétil, arco, besta, ataque mágico, Artes físicas à distância): relativo nos dois sentidos, alvo maior +3 por categoria, alvo menor −3 por categoria.', 'O enxame usa o tamanho que apresenta, nos dois papéis.', 'O porte não escala a Efetiva.', 'nem para Artes de área sem rolagem de ataque']) if (!PA.nota.includes(fr)) f.push(`porteAcerto.nota: falta "${fr.slice(0, 70)}"`);
    if (/teto de 4 categorias \(diferenças|Relativo e simétrico|teto ±6/.test(PA.nota)) f.push('porteAcerto.nota: sobrou a regra velha (teto de 4 categorias, simétrico, teto ±6)');
  }
  // glossário
  const gp = (gloss || []).find?.((x) => x.id === 'porte') ?? null;
  if (!gp) f.push('glossario.json: não achei o termo Porte');
  else {
    if (!gp.definicao.includes('cada categoria de diferença soma +3, sem teto, só no acerto. No corpo a corpo só o menor ganha (o maior ataca o menor sem penalidade); à distância é relativo nos dois sentidos (alvo maior +3 por categoria, alvo menor −3).')) f.push('glossario.json, Porte: falta a definição nova (+3, sem teto, só o menor ganha no corpo a corpo, relativo à distância)');
    if (/simétrico, teto de 4 categorias|\+3\/\+6\/\+9\/\+12/.test(gp.definicao)) f.push('glossario.json, Porte: sobrou o teto de 4 categorias');
  }
  // as paginas da mesa
  if (ref) {
    if (/Teto de \{PORTE\.capCategorias\}|porDiferenca|±\$\{v\}/.test(ref)) f.push('referencia.astro: o porte ainda lê porDiferenca/capCategorias (a tabela devia vir de porteAcerto.reforma)');
    for (const fr of ['<tr><td>Corpo a corpo, alvo maior</td>', '<tr><td>Corpo a corpo, alvo menor</td>{DIFS.map(() => (<td class="num">0</td>))}</tr>', '<tr><td>À distância, alvo menor</td>', 'Sem teto.</p>']) if (!ref.includes(fr)) f.push(`referencia.astro, porte: falta "${fr.slice(0, 70)}"`);
  }
  if (mesa && /fora deste teto/.test(mesa)) f.push('mesa.astro: sobrou "fora deste teto" no porte');
  return f;
}
{
  const GLOSS = JSON.parse(ler('src/data/glossario.json'));
  const GL = Array.isArray(GLOSS) ? GLOSS : (GLOSS.termos || GLOSS.itens || Object.values(GLOSS));
  const MESA2 = ler('src/pages/mesa.astro').replace(/\r\n/g, '\n'), REF2 = ler('src/pages/mesa/referencia.astro').replace(/\r\n/g, '\n');
  const realP = conferirPorte(COMB, REGRAS, GL, REF2, MESA2);
  for (const x of realP) falhas.push(x);
  const ed = (r, fn) => { const x = copia(r); fn(x); return x; };
  const mutP = realP.length ? {} : {
    'o teto de ±12 de volta na tabela': (c) => [c.replace('| **Maior** em *n* categorias | **+3 × n** | **+3 × n** |', '| **Maior** em *n* categorias | **+3 × n** (até +12) | **+3 × n** |')],
    'o corpo a corpo simétrico': (c) => [c.replace('Quem é igual ou maior ataca **sem penalidade** e sem bônus.', 'Quem é maior ataca com penalidade.')],
    'o corpo a corpo com −3 para o maior': (c) => [c.replace('| **Menor** em *n* categorias | **0** | **−3 × n** |', '| **Menor** em *n* categorias | **−3 × n** | **−3 × n** |')],
    'a distância sem o relativo': (c) => [c.replace('alvo **menor**, **−3 por categoria**.', 'alvo menor, igual.')],
    'sem o "sem teto"': (c) => [c.replace('soma **+3**, **sem teto**.', 'soma **+3**, até 4 categorias.')],
    'o enxame sumido': (c) => [c.replace('Um **enxame** usa o tamanho que **apresenta**, nos dois papéis, como alvo e como atacante.', '')],
    'a exclusão social/mental/área sumida': (c) => [c.replace('ataques **Sociais** ou **Mentais**, nem a Artes de **área** sem rolagem de ataque.', 'ataques Sociais.')],
    'a nota ao Mestre sumida': (c) => [c.replace('<div class="callout regra"><span class="lbl">Nota ao Mestre</span>Criaturas maiores que Médio', '<div class="callout regra"><span class="lbl">Aviso</span>Criaturas maiores que Médio')],
    'o teto de ±6 de volta no porte': (c) => [c.replace('(então fica fora do teto de +6 dos bônus de Defesa)', 'e não entra no teto de ±6')],
    'a frase de Manobras com a penalidade': (c) => [c.replace('só o menor ganha bônus contra o maior (ver *Porte*).', 'o bônus e a penalidade valem como em qualquer ataque.')],
    'a Efetiva escalada pelo porte': (c) => [c.replace('o porte não escala a Efetiva', 'o porte escala a Efetiva')],
    'o teto de 4 categorias em regras.json': (c, r) => [c, ed(r, (x) => { x.porteAcerto.nota += ' Conta a diferença de categorias na ordem dos portes, com teto de 4 categorias (diferenças maiores contam como 4).'; })],
    'o porCategoria estragado': (c, r) => [c, ed(r, (x) => { x.porteAcerto.reforma.porCategoria = 4; })],
    'o capCategorias do Grid mexido': (c, r) => [c, ed(r, (x) => { x.porteAcerto.capCategorias = 6; })],
    'a gridNota sumida': (c, r) => [c, ed(r, (x) => { delete x.porteAcerto.gridNota; })],
    'o glossário com o teto de 4 categorias': (c, r, g) => [c, r, g.map((t) => (t.id === 'porte' ? { ...t, definicao: t.definicao + ' (simétrico, teto de 4 categorias)' } : t))],
    'a tabela da referência lendo o teto velho': (c, r, g, rf) => [c, r, g, rf.replace('Sem teto.</p>', 'Teto de {PORTE.capCategorias} categorias.</p>')],
    'a frase da mesa com o teto': (c, r, g, rf, m) => [c, r, g, rf, m.replace('O porte entra no <em>acerto</em>, sem teto:', 'O porte entra no <em>acerto</em>, fora deste teto:')],
  };
  for (const [nome, estraga] of Object.entries(mutP)) {
    const [c, r = REGRAS, g = GL, rf = REF2, m = MESA2] = estraga(COMB, REGRAS, GL, REF2, MESA2);
    if (c === COMB && r === REGRAS && g === GL && rf === REF2 && m === MESA2) { falhas.push(`o estrago "${nome}" não alterou nada (o teste de teste está torto)`); continue; }
    if (conferirPorte(c, r, g, rf, m).length === 0) falhas.push(`o teste NÃO acusou o estrago do Porte "${nome}"`);
  }
  TOTAL_ARTE += Object.keys(mutP).length;
}

// ---- Manobras: Preso, Agarrado e Imobilizado (rodada 7, D-081 e D-079)
// O agarrado leva Esquiva −8 e Bloqueio −4 só contra quem está de fora; o Imobilizado tem Esquiva e Bloqueio zerados, e não a
// Defesa de agarrão; o Preso tem dois perfis (a tabela e a Rede); o agarrão comum só gera Agarrado.
function conferirManobras(comb) {
  const f = [];
  const L = comb.split('\n');
  const comeca = (ini, frases, onde) => {
    const l = L.find((x) => x.startsWith(ini));
    if (!l) { f.push(`${onde}: falta a linha que começa com "${ini.slice(0, 50)}"`); return; }
    for (const fr of frases) if (!l.includes(fr)) f.push(`${onde}: a linha "${ini.slice(0, 30)}" não tem "${fr.slice(0, 90)}"`);
  };
  comeca('**O agarrado.**', ['Contra quem ataca de fora, a Esquiva dele leva −8 e o Bloqueio −4, mais as penalidades da situação (por exemplo, no chão), sem dobro', 'Entre os dois envolvidos não há penalidade de ataque nem de Defesa', 'Não age e não rola nada: só escapa quando quem o controla erra.'], 'Manobras, O agarrado');
  comeca('* **Preso:**', ['Vem da boleadeira, da Rede e da Arte de prender, e tem dois perfis.', '**Pela tabela de restrição** (a boleadeira e a Arte de prender, parcial nas pernas): Esquiva −4.', '**Pela Rede**, que tem regra própria ([Armas & Armaduras](/regras/armas-e-armaduras)): −2 na Esquiva e −2 no Bloqueio, e mais −1 em cada por grau de Margem do lançamento, sem teto.', 'Força + Atletismo contra o total do lançamento, uma tentativa por ação', 'contra a Dificuldade do Efeito'], 'Manobras, Preso');
  comeca('* **Agarrado:**', ['O agarrão comum só gera Agarrado: não prende (Preso) nem imobiliza.'], 'Manobras, Agarrado');
  comeca('* **Imobilizado:**', ['A Esquiva e o Bloqueio dele ficam **zerados** (não a Defesa de agarrão)', 'Nenhum movimento, não age (nem com Firula)'], 'Manobras, Imobilizado');
  if (/a Defesa dele leva −2|A Defesa dele cai −4/.test(comb)) f.push('Manobras: sobrou "a Defesa dele leva −2 mais as penalidades" ou "A Defesa dele cai −4"');
  return f;
}
{
  const realM = conferirManobras(COMB);
  for (const x of realM) falhas.push(x);
  const mutM = realM.length ? {} : {
    'o agarrado a −2 de volta': (c) => c.replace('a Esquiva dele leva −8 e o Bloqueio −4, mais', 'a Defesa dele leva −2 mais'),
    'o agarrado com −8/−8': (c) => c.replace('a Esquiva dele leva −8 e o Bloqueio −4', 'a Esquiva dele leva −8 e o Bloqueio −8'),
    'a penalidade entre os dois': (c) => c.replace('Entre os dois envolvidos não há penalidade de ataque nem de Defesa', 'Entre os dois envolvidos há penalidade de Defesa'),
    'o Imobilizado a −4 de volta': (c) => c.replace('A Esquiva e o Bloqueio dele ficam **zerados** (não a Defesa de agarrão), como em *Corpo, total* (ver *Restrição de corpo e de lugar*).', 'A Defesa dele cai −4 (Vantagem tática).'),
    'o Imobilizado sem a exceção da Defesa de agarrão': (c) => c.replace('ficam **zerados** (não a Defesa de agarrão)', 'ficam **zerados**'),
    'o Preso sem o perfil da Rede': (c) => c.replace('**Pela Rede**, que tem regra própria', '**Pela Rede**, que não tem regra própria'),
    'o Preso pela tabela a −2': (c) => c.replace('parcial nas pernas): Esquiva −4.', 'parcial nas pernas): Esquiva −2.'),
    'a Rede com teto de Margem': (c) => c.replace('por grau de Margem do lançamento, sem teto.', 'por grau de Margem do lançamento, até −3.'),
    'o agarrão que prende': (c) => c.replace('O agarrão comum só gera Agarrado: não prende (Preso) nem imobiliza.', 'O agarrão comum também prende.'),
    'a fuga sem a Força + Atletismo': (c) => c.replace('Força + Atletismo contra o total do lançamento, uma tentativa por ação', 'a jogada de quem prendeu'),
  };
  for (const [nome, estraga] of Object.entries(mutM)) {
    const c = estraga(COMB);
    if (c === COMB) { falhas.push(`o estrago "${nome}" não alterou nada (o teste de teste está torto)`); continue; }
    if (conferirManobras(c).length === 0) falhas.push(`o teste NÃO acusou o estrago de Manobras "${nome}"`);
  }
  TOTAL_ARTE += Object.keys(mutM).length;
}

if (falhas.length) {
  console.error(`✘ test-capitulo-armas: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
const total = TOTAL_ARTE + Object.keys(estragosTexto).length + Object.keys(estragosCatalogo).length + 2 + 7 + 1 + 9 + 13 + 9 + 3;
console.log(`✓ test-capitulo-armas · as tabelas de Arremesso, Atirador, Classes e a Máxima por Força do capítulo batem com armas.json e regras.json · ${total} estragos acusados`);
