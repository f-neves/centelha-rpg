// gen-criaturas-esperado.mjs · os números conferidos das fichas de criatura, antes do motor (plano-conversao.md, A1).
//
// Lê cada ficha .md de `tmp/arquiteto/bestiario/fichas-v3/` (fora do repositório) e grava em
// `scripts/fixtures/criaturas-esperado.json`, por criatura:
//   - `entrada`: o que o motor precisa para fazer as contas, com os nomes do formato novo (formato-criatura.md, seção 2);
//   - `ficha`: o que a ficha diz e que serve à escolha (o Tamanho escrito, a linha de PV usada, o enxame);
//   - `esperado`: os números que a ficha escreve e o conferidor da Bestiarista confere (PV, Defesas, Absorção, peso
//     erguido, Tamanho, faixa, Energia, Iniciativa, Mana e, por ataque, a jogada, o dano médio e a Velocidade);
//   - `formas`: o mesmo, das formas que a linha Variantes descreve com número;
//   - `naoLido`: o que a ficha não deixou ler, para a conta não ser cobrada às cegas.
// O que a ficha não diz fica de fora: nenhum número é inferido, porque inferir seria uma segunda conta (o plano, seção 5,
// "um teste com a fórmula copiada é um segundo motor"). Quem confere é o scripts/test-motor.mjs.
//
// O arquivo cresce a cada lote da Bestiarista: rode de novo depois de cada entrada (ESTADO.md, "Entradas automáticas").
//   node scripts/gen-criaturas-esperado.mjs [pasta das fichas]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { lerFichaMd, campo, negritos, numBR, semMarcas, slug, idAtributo, idHabilidade } from './lib-ficha-md.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PASTA = path.resolve(process.argv[2] || path.join(RAIZ, '..', 'tmp', 'arquiteto', 'bestiario', 'fichas-v3'));
const SAIDA = path.join(RAIZ, 'scripts', 'fixtures', 'criaturas-esperado.json');
const UN = { g: 0.001, kg: 1, t: 1000 };
const soDeCriatura = {};
const HAB_ATAQUE = 'Briga|Armas|Disparo|Atirador|Arremesso';
const inteiro = (s) => { const m = String(s ?? '').match(/[−-]?\d+/); return m ? Number(m[0].replace('−', '-')) : undefined; };
const ultimo = (s) => { const n = negritos(s); return n.length ? n[n.length - 1] : undefined; };
const massaKg = (s) => { const m = String(s).match(/\*\*(?:cerca de )?([\d.,]+) (g|kg|t)\b/); return m ? numBR(m[1]) * UN[m[2]] : undefined; };

function lerDano(txt) {
  let d = semMarcas(txt).replace(/\*\*/g, '').replace(/PROVIS\S*/g, '').trim();
  if (/^nenhum/.test(d) || !d) return { dado: null, multiplicadorForca: 0 };
  if (d.includes('=')) d = d.split('=').pop().trim();
  const m = d.match(/^(\d+)d6(?:\s*([+−-])\s*(\d+))?/);
  if (!m) return undefined;
  const bonus = m[3] ? `${m[2] === '+' ? '+' : '-'}${m[3]}` : '';
  const mult = d.match(/Força\s*×\s*(\d)/) ? Number(d.match(/Força\s*×\s*(\d)/)[1]) : /Força\s*\(/.test(d) ? 1 : 0;
  return { dado: `${m[1]}d6${bonus}`, multiplicadorForca: mult };
}

// A jogada que a frase "Jogada:" da Justificativa escreve: o Atributo, a Habilidade e o termo da Centelha, sem o Acerto
// da coluna. Devolve a Habilidade (id) e a soma dos três números escritos; undefined quando a frase não os traz.
function lerJogada(just) {
  const j = (String(just).match(/Jogada:([^|]*)/) || [])[1];
  if (!j) return undefined;
  let atr, hab, nomeHab, termo = 0;
  const mh = j.match(new RegExp(`(\\d+)(?:\\s*\\([^)]*\\))?\\s*\\+\\s*(${HAB_ATAQUE})\\s+(\\d+)`));
  if (mh) { atr = Number(mh[1]); nomeHab = mh[2]; hab = Number(mh[3]); }
  else {
    const mp = j.match(new RegExp(`(${HAB_ATAQUE})[^(]*\\((\\d+)\\s*\\+\\s*(\\d+)`));
    if (!mp) return undefined;
    nomeHab = mp[1]; atr = Number(mp[2]); hab = Number(mp[3]);
  }
  const mc = j.match(/o menor entre Centelha \d+ e \S+ \d+\s*(?:\((\d+)\)|=\s*(\d+))/);
  if (mc) termo = Number(mc[1] ?? mc[2]);
  else if (/o menor entre/.test(j)) return undefined;
  return { habilidade: idHabilidade(nomeHab)?.id ?? slug(nomeHab), jogada: atr + hab + termo };
}

// "Faixa de PV de 35 a 220 kg (massa 40 kg ...)": a linha que a ficha usou, para dizer se ela subiu ou desceu de linha
// na zona de transição (decisoes-autor §13). Só se lê o texto: fora dos limites que a própria ficha escreve.
function lerLinhaPV(txt, massa) {
  const m = String(txt).match(/Faixa de PV de ([\d.,]+) ?(g|kg|t)? a ([\d.,]+) ?(g|kg|t)/);
  if (!m || massa === undefined) return undefined;
  const de = numBR(m[1]) * UN[m[2] || m[4]], ate = numBR(m[3]) * UN[m[4]];
  if (massa > ate) return 'abaixo';
  if (massa < de) return 'acima';
  return undefined;
}

function lerCriatura(id, texto) {
  const F = lerFichaMd(texto), T = F.tabelas, nao = [];
  const I = T['Identidade'], C = T['Corpo, área e porte'] ?? T['Corpo e porte'], M = T['Corpo e movimento'];
  const cpc = (campo(I, 'Categoria · papel · Centelha') || '').split('·').map((x) => semMarcas(x).replace(/\*\*/g, '').trim());
  const entrada = { categoria: slug(cpc[0] || ''), centelha: inteiro(cpc[2]) };
  if (entrada.centelha === undefined) nao.push('Centelha');

  entrada.atributos = {};
  for (const r of T['Atributos'] || []) {
    const [nome, valor] = Object.values(r), aid = idAtributo(semMarcas(nome));
    if (aid) entrada.atributos[aid] = inteiro(valor); else nao.push(`Atributo "${nome}"`);
  }
  entrada.habilidades = {}; entrada.habilidadesSec = {};
  for (const r of T['Habilidades'] || []) {
    const [nome, valor] = Object.values(r), limpo = semMarcas(nome).replace(/\s*\(.*\)\s*$/, '').trim();
    // a secundária só de criatura (Musculatura, Voo, Disparo, Corrida) não está no catálogo do personagem: vai a
    // habilidadesSec pelo id do nome (formato-criatura.md, 2.3), e o topo do arquivo a conta
    const h = idHabilidade(limpo) || { id: slug(limpo), secundaria: true, soDeCriatura: true };
    if (h.soDeCriatura) soDeCriatura[h.id] = (soDeCriatura[h.id] || 0) + 1;
    (h.secundaria ? entrada.habilidadesSec : entrada.habilidades)[h.id] = inteiro(valor);
  }
  entrada.vontade = inteiro(campo(T['Vontade, Virtudes e Aparência'], 'Vontade'));

  const lm = campo(C, 'Massa') || '', corpo = {};
  if (/\*\*sem massa\*\*/.test(lm)) {
    corpo.semMassa = true;
    const v = lm.match(/volume \*\*([\d.,]+) m³\*\*/);
    if (v) corpo.volume = numBR(v[1]); else nao.push('volume do incorpóreo');
  } else {
    corpo.massa = massaKg(lm);
    if (corpo.massa === undefined) nao.push('Massa');
  }
  const la = campo(C, 'Área'), lt = campo(C, 'Tamanho') || '';
  const ar = String(la ?? '').match(/\*\*([\d.,]+) m²\*\*/) || lt.match(/\(([\d.,]+) m²/);
  if (ar) corpo.area = numBR(ar[1]); else nao.push('Área');
  const ls = campo(C, 'Segundo Tamanho') || '';
  const segundo = /^\s*\*\*/.test(ls) ? (ls.match(/^\s*\*\*([^*]+)\*\*/) || [])[1] : undefined;
  if (segundo) {
    const sa = ls.match(/\(([\d.,]+) m²/);
    if (sa) corpo.segundoTamanho = { area: numBR(sa[1]) }; else nao.push('área do Segundo Tamanho');
  }
  entrada.corpo = corpo;
  entrada.bonusPV = inteiro(campo(M, 'Bônus de PV')) ?? 0;
  entrada.couraca = F.bloco?.couracaNivel;

  const vAr = semMarcas(campo(I, 'Artes') || 'nenhuma').replace(/`/g, '');
  entrada.artes = {};
  if (vAr !== 'nenhuma') for (const p of vAr.split(' · ')) {
    const m = p.trim().match(/^([a-z0-9-]+) (\d+)$/);
    if (m) entrada.artes[m[1]] = Number(m[2]); else nao.push(`Arte "${p.trim()}"`);
  }
  const vEq = semMarcas(campo(I, 'Equipamento') || 'nenhum').replace(/`/g, '');
  if (vEq !== 'nenhum') {
    const m = vEq.match(/^armas: (.+?) · armaduras: (\S+) · escudos: (\S+)/);
    if (!m) nao.push('Equipamento');
    else entrada.equipamento = {
      armas: m[1].split(',').map((x) => x.trim()).filter((x) => x !== 'nenhuma'),
      armadura: m[2] === 'nenhuma' ? null : m[2], escudo: m[3] === 'nenhum' ? null : m[3],
    };
  }

  // os ataques: a tabela pelo nome da coluna (as fichas antigas escrevem "Ataque" e "Nível")
  entrada.ataques = []; const espAtaques = [];
  for (const r of T['Ataques'] || []) {
    const nome = semMarcas(r['Nome'] ?? r['Ataque'] ?? '');
    if (!nome || nome === 'Nome' || nome === 'Ataque') continue;
    const dano = lerDano(r['Dano'] ?? '');
    const pgr = String(r['P/G/R'] ?? '').match(/(\d+)\/(\d+)\/(\d+)/);
    const a = { nome, classe: slug(semMarcas(r['Classe'] ?? '')), acerto: inteiro(r['Acerto']) ?? 0 };
    if (pgr) a.pgr = pgr.slice(1).map(Number); else nao.push(`P/G/R de "${nome}"`);
    if (dano) Object.assign(a, dano); else nao.push(`Dano de "${nome}"`);
    const bl = String(r['Bloqueia como arma'] ?? '').match(/sim\s*\(([+−-]?\d+)\)/);
    a.bloqueiaComoArma = bl ? inteiro(bl[1]) : null;
    const jog = lerJogada(r['Justificativa'] ?? '');
    const igual = String(r['Justificativa'] ?? '').match(/Jogada igual à d[ao]s? (.+?)(?:\.|$)/);
    const esp = { nome, velocidade: inteiro(r['Velocidade']) };
    const dm = semMarcas(r['Dano médio'] ?? '').replace(/\*\*/g, '');
    if (/\d/.test(dm)) esp.danoMedio = numBR(dm.match(/[\d.,]+/)[0]);
    if (jog) { if (jog.habilidade) a.habilidade = jog.habilidade; esp.jogada = jog.jogada; }
    else if (igual) esp.jogadaIgualA = igual[1].trim();
    entrada.ataques.push(a); espAtaques.push(esp);
  }
  for (const e of espAtaques) if (e.jogadaIgualA) {
    const o = espAtaques.find((x) => x.nome === e.jogadaIgualA), oa = entrada.ataques.find((x) => x.nome === e.jogadaIgualA);
    if (o?.jogada !== undefined) {
      e.jogada = o.jogada;
      const a = entrada.ataques.find((x) => x.nome === e.nome);
      if (oa?.habilidade) a.habilidade = oa.habilidade;
    }
    delete e.jogadaIgualA;
  }

  const ficha = {};
  const tamFicha = (lt.match(/^\s*\*\*([^*]+)\*\*/) || [])[1];
  if (tamFicha) ficha.tamanho = tamFicha; else nao.push('Tamanho');
  if (segundo) ficha.segundoTamanho = segundo;
  const pvBase = campo(M, 'PV base') || '';
  const linha = lerLinhaPV(pvBase, corpo.massa);
  if (linha) ficha.linhaPV = linha;
  const enx = pvBase.match(/^Por quadrado cheio .*?conta como criatura (\S+?),/);
  if (enx) ficha.enxame = { contaComo: enx[1] };

  const esperado = {};
  const b = F.bloco;
  if (!b) nao.push('bloco de conferência');
  else {
    esperado.pv = b.pv; esperado.pesoErguido = b.pesoErguido ?? null; esperado.faixa = b.faixa; esperado.tamanho = b.alvo;
    if (tamFicha && tamFicha !== b.alvo) nao.push(`Tamanho: a linha diz ${tamFicha}, o bloco ${b.alvo}`);
  }
  if (segundo) esperado.segundoTamanho = segundo;
  for (const [rot, k] of [['Esquiva', 'esquiva'], ['Bloqueio', 'bloqueio'], ['Energia', 'energia']]) {
    const v = ultimo(campo(M, rot));
    if (v !== undefined) esperado[k] = v; else nao.push(rot);
  }
  for (const [rot, k] of [['Defesa Mental', 'defesaMental'], ['Defesa Social', 'defesaSocial']]) {
    const c = campo(M, rot) || '';
    const v = /\*\*imune\*\*/.test(c) ? 'imune' : ultimo(c);
    if (v !== undefined) esperado[k] = v; else nao.push(rot);
  }
  const ini = String(campo(M, 'Iniciativa') || '').match(/1d6((?:\s*\+\s*\d+)+)/);
  if (ini) esperado.iniciativa = [...ini[1].matchAll(/\d+/g)].reduce((s, x) => s + Number(x[0]), 0); else nao.push('Iniciativa');
  const ma = campo(I, 'Mana');
  esperado.mana = ma === undefined || /não tem/.test(ma) ? null : ultimo(ma);
  const lab = campo(M, 'Absorção') || '';
  const [natural, ...resto] = lab.split(/(?=\bCom [^:|]+?:\s*Esquiva)/);
  const abs = {};
  for (const [rot, k] of [['Impacto', 'impacto'], ['Corte', 'corte'], ['Perfuração', 'perfuracao']]) {
    const m = natural.match(new RegExp(`\\b${rot} \\*\\*(\\d+)\\*\\*`));
    if (m) abs[k] = Number(m[1]);
  }
  if (abs.impacto === undefined) nao.push('Absorção');
  esperado.absorcao = abs;
  const feq = resto.join('').match(/Com ([^:|]+?):\s*Esquiva\s*\**(\d+)\**,\s*Bloqueio\s*\**(\d+)\**;\s*Impacto\s*\**(\d+)\**,\s*Corte\s*\**(\d+)\**,\s*Perfuração\s*\**(\d+)\**(?:\s*\(Nível\s*N(\d)\))?(?:;\s*Penalidade\s*[−-]\s*(\d+))?(?:;\s*contra tiro\s*\**(\d+)\**)?/);
  if (feq) {
    esperado.comEquipamento = { esquiva: +feq[2], bloqueio: +feq[3], impacto: +feq[4], corte: +feq[5], perfuracao: +feq[6], penalidade: +(feq[8] || 0) };
    if (feq[7]) esperado.comEquipamento.nivelPerfuracao = +feq[7];
    if (feq[9]) esperado.comEquipamento.contraTiro = +feq[9];
  } else if (entrada.equipamento && (entrada.equipamento.armadura || entrada.equipamento.escudo)) nao.push('a frase "Com <equipamento>"');
  esperado.ataques = espAtaques;

  // as formas que a linha Variantes descreve com número (D-201, D-217): o que muda, e o que a ficha diz dela
  let formas;
  const lf = campo(I, 'Formas');
  if (lf) {
    formas = {};
    const nomes = semMarcas(lf).replace(/\*\*/g, '').split(' · ').map((x) => x.trim());
    for (const r of T['Variantes'] || []) {
      const [nomeV, muda] = Object.values(r);
      if (!nomes.slice(1).includes(nomeV)) continue;
      const f = { entrada: { atributos: {}, corpo: {} }, esperado: {} };
      for (const m of muda.matchAll(/(?:^|;\s*)(Força|Destreza|Vigor|Percepção|Inteligência|Raciocínio|Influência|Perspicácia|Compostura) (\d+)/g)) f.entrada.atributos[idAtributo(m[1])] = Number(m[2]);
      const mm = muda.match(/(?:^|;\s*)Massa: ([\d.,]+) (g|kg|t)/); if (mm) f.entrada.corpo.massa = numBR(mm[1]) * UN[mm[2]];
      const mar = muda.match(/(?:^|;\s*)Área: ([\d.,]+) m²/); if (mar) f.entrada.corpo.area = numBR(mar[1]);
      const mc = muda.match(/Couraça nível (\d+)/); if (mc) f.entrada.couraca = Number(mc[1]);
      const mpv = muda.match(/(?:^|;\s*)PV (\d+)/); if (mpv) f.esperado.pv = Number(mpv[1]);
      const mpe = muda.match(/(?:^|;\s*)Peso erguido: ([\d.,]+) kg/); if (mpe) f.esperado.pesoErguido = numBR(mpe[1]);
      const mt = muda.match(/(?:^|;\s*)Tamanho: (\S+?)[\s;(]/); if (mt) f.esperado.tamanho = mt[1];
      const mfx = muda.match(/\(Faixa (\d)\)/); if (mfx) f.esperado.faixa = Number(mfx[1]);
      formas[slug(nomeV.replace(/^forma (de |d[ao] )?/, ''))] = { nome: nomeV, ...f };
    }
  }
  const o = { entrada, ficha, esperado };
  if (formas && Object.keys(formas).length) o.formas = formas;
  if (nao.length) o.naoLido = nao;
  return o;
}

const arquivos = fs.readdirSync(PASTA).filter((a) => a.endsWith('.md')).sort();
const criaturas = {};
for (const a of arquivos) {
  const buf = fs.readFileSync(path.join(PASTA, a));
  criaturas[a.slice(0, -3)] = { sha256: crypto.createHash('sha256').update(buf).digest('hex'), ...lerCriatura(a.slice(0, -3), buf.toString('utf8')) };
}
const comFalta = Object.entries(criaturas).filter(([, c]) => c.naoLido);
const saida = {
  fonte: {
    pasta: 'tmp/arquiteto/bestiario/fichas-v3', data: new Date().toLocaleDateString('sv-SE'), fichas: arquivos.length,
    gerador: 'scripts/gen-criaturas-esperado.mjs',
    habilidadesSoDeCriatura: soDeCriatura,
  },
  criaturas,
};
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1) + '\n');
const nAt = Object.values(criaturas).reduce((s, c) => s + c.esperado.ataques.length, 0);
const nJog = Object.values(criaturas).reduce((s, c) => s + c.esperado.ataques.filter((x) => x.jogada !== undefined).length, 0);
console.log(`criaturas-esperado.json: ${arquivos.length} fichas, ${nAt} ataques (${nJog} com a jogada escrita), ${comFalta.length} fichas com algo que não se leu`);
for (const [id, c] of comFalta) console.log(`  ${id}: ${c.naoLido.join('; ')}`);
