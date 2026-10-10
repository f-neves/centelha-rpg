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
    // o corpo a corpo, como ainda está (até a rodada 4b): Preparo fixo da classe e P + G + R = Velocidade
    const FIXO = { Leve: 'leve', 'Média': 'media', Haste: 'haste', Pesada: 'pesada' };
    for (const [nome, cls] of Object.entries(FIXO)) {
      const l = linha(nome);
      if (!l) { f.push(`Combate: falta a linha "${nome}"`); continue; }
      const [v, pr, g, r] = l.slice(1).map(num);
      const fixo = regras?.combate?.pgr?.preparo?.[cls]?.fixo;
      if (pr !== fixo) f.push(`Combate, ${nome}: Preparo ${pr} no capítulo, ${fixo} em regras.json`);
      if (g !== 1 || pr + g + r !== v) f.push(`Combate, ${nome}: ${pr} + ${g} + ${r} nao fecha a Velocidade ${v}`);
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
  return f;
}

const falhas = [];
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
    'Preparo do Leve em Combate (corpo a corpo)': (t) => t.replace('| Leve | 5 | 0 | 1 | 4 |', '| Leve | 5 | 1 | 1 | 3 |'),
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
  const R5 = copia(REGRAS); R5.combate.pgr.reforma.tiro.find((c) => c.id === 'arco-curto').preparo = 5;
  if (conferir(CAP, ARMAS, R5, COMB).length === 0) falhas.push('o teste NÃO acusou o Preparo do Arco Curto alterado em regras.json');
}

if (falhas.length) {
  console.error(`✘ test-capitulo-armas: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
const total = Object.keys(estragosTexto).length + Object.keys(estragosCatalogo).length + 2 + 7 + 1 + 9;
console.log(`✓ test-capitulo-armas · as tabelas de Arremesso, Atirador, Classes e a Máxima por Força do capítulo batem com armas.json e regras.json · ${total} estragos acusados`);
