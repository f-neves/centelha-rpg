// gen-criaturas-esperado.mjs · os números conferidos das fichas de criatura, para o motor (plano-conversao.md, A1).
//
// Lê cada ficha .md de `tmp/arquiteto/bestiario/fichas-v3/` (fora do repositório) e grava em
// `scripts/fixtures/criaturas-esperado.json`, por criatura:
//   - `entrada`: o que o motor precisa, tirado do JSON que o conversor escreve (scripts/conversor-criatura.mjs, A3), e
//     não de uma leitura própria: um leitor só, para o motor ser testado com o que a troca vai lhe dar (A5);
//   - `esperado`: os números que a ficha escreve e o conferidor da Bestiarista confere (PV, Defesas, Absorção, peso
//     erguido, Tamanho, faixa, Energia, Iniciativa, Mana e, por ataque, a jogada, o dano médio e a Velocidade);
//   - `formas`: o mesmo, das formas que a linha Variantes descreve com número;
//   - `ficha`: o que a ficha diz e o formato ainda não tem (o enxame);
//   - `paradas`: o que o conversor não entendeu na ficha (a criatura entra assim mesmo: os números dela se conferem);
//   - `naoLido`: o número que a ficha não deixou ler, para a conta não ser cobrada às cegas.
// O que a ficha não diz fica de fora: nenhum número é inferido, porque inferir seria uma segunda conta (o plano, seção 5,
// "um teste com a fórmula copiada é um segundo motor"). Quem confere é o scripts/test-motor.mjs.
//
// O arquivo cresce a cada lote da Bestiarista: rode de novo depois de cada entrada (ESTADO.md, "Entradas automáticas").
//   node scripts/gen-criaturas-esperado.mjs [pasta das fichas]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { lerFichaMd, campo, negritos, numBR, semMarcas, slug } from './lib-ficha-md.mjs';
import { converterFicha } from './conversor-criatura.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const PASTA = path.resolve(process.argv[2] || path.join(RAIZ, '..', 'tmp', 'arquiteto', 'bestiario', 'fichas-v3'));
const SAIDA = path.join(RAIZ, 'scripts', 'fixtures', 'criaturas-esperado.json');
const SITE = path.join(RAIZ, 'src', 'data', 'bestiario');
const TAMANHOS = 'Minúsculo|Miúdo|Pequeno|Médio|Grande|Enorme|Imenso|Colossal';
const HAB_ATAQUE = 'Briga|Armas|Disparo|Atirador|Arremesso';
const CHAVES_MOTOR = ['enxame', 'categoria', 'centelha', 'atributos', 'habilidades', 'habilidadesSec', 'vontade', 'corpo', 'bonusPV', 'couraca', 'artes', 'equipamento', 'ataques'];
const inteiro = (s) => { const m = String(s ?? '').match(/[−-]?\d+/); return m ? Number(m[0].replace('−', '-')) : undefined; };
const ultimo = (s) => { const n = negritos(s); return n.length ? n[n.length - 1] : undefined; };
const escolhe = (o, ks) => Object.fromEntries(ks.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]));

// A jogada que a frase "Jogada:" da Justificativa escreve: o Atributo, a Habilidade e o termo da Centelha, sem o Acerto
// da coluna. Devolve a soma dos três números escritos; undefined quando a frase não os traz.
function lerJogada(just) {
  const j = (String(just).match(/Jogada:([^|]*)/) || [])[1];
  if (!j) return undefined;
  let atr, hab, termo = 0;
  const mh = j.match(new RegExp(`(\\d+)(?:\\s*\\([^)]*\\))?\\s*\\+\\s*(${HAB_ATAQUE})\\s+(\\d+)`));
  if (mh) { atr = Number(mh[1]); hab = Number(mh[3]); }
  else {
    const mp = j.match(new RegExp(`(${HAB_ATAQUE})[^(]*\\((\\d+)\\s*\\+\\s*(\\d+)`));
    if (!mp) return undefined;
    atr = Number(mp[2]); hab = Number(mp[3]);
  }
  const mc = j.match(/o menor entre Centelha \d+ e \S+ \d+\s*(?:\((\d+)\)|=\s*(\d+))/);
  if (mc) termo = Number(mc[1] ?? mc[2]);
  else if (/o menor entre/.test(j)) return undefined;
  return atr + hab + termo;
}

export function lerEsperado(texto) {
  const F = lerFichaMd(texto), T = F.tabelas, nao = [];
  const I = T['Identidade'], C = T['Corpo, área e porte'] ?? T['Corpo e porte'], M = T['Corpo e movimento'];
  const esperado = {}, ficha = {};
  const b = F.bloco;
  if (!b) nao.push('bloco de conferência');
  else { esperado.pv = b.pv; esperado.pesoErguido = b.pesoErguido ?? null; esperado.faixa = b.faixa; esperado.tamanho = b.alvo; }
  const lt = campo(C, 'Tamanho') || '';
  const tamFicha = (lt.match(new RegExp(`^\\s*\\*\\*(${TAMANHOS})\\b`)) || [])[1];
  if (tamFicha && b && tamFicha !== b.alvo) nao.push(`Tamanho: a linha diz ${tamFicha}, o bloco ${b.alvo}`);
  const ls = semMarcas(campo(C, 'Segundo Tamanho') || '');
  const segundo = (ls.match(new RegExp(`^\\s*\\*\\*(${TAMANHOS})\\b`)) || [])[1];
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
  }
  const ataques = [];
  for (const r of T['Ataques'] || []) {
    const nome = semMarcas(r['Nome'] ?? r['Ataque'] ?? '');
    if (!nome || nome === 'Nome' || nome === 'Ataque') continue;
    const e = { nome, velocidade: inteiro(r['Velocidade']) };
    const dm = semMarcas(r['Dano médio'] ?? '').replace(/\*\*/g, '');
    if (/\d/.test(dm)) e.danoMedio = numBR(dm.match(/[\d.,]+/)[0]);
    const jog = lerJogada(r['Justificativa'] ?? '');
    const igual = String(r['Justificativa'] ?? '').match(/Jogada igual à d[ao]s? (.+?)(?:\.|$)/);
    if (jog !== undefined) e.jogada = jog; else if (igual) e._igual = igual[1].trim();
    ataques.push(e);
  }
  for (const e of ataques) if (e._igual) { const o = ataques.find((x) => x.nome === e._igual); if (o?.jogada !== undefined) e.jogada = o.jogada; delete e._igual; }
  esperado.ataques = ataques;
  // o que a linha Variantes diz de cada forma com número (o PV, o peso erguido, o Tamanho e a faixa)
  const formas = {};
  const lf = campo(I, 'Formas');
  if (lf) {
    const nomes = semMarcas(lf).replace(/\*\*/g, '').split(' · ').map((x) => x.trim());
    for (const r of T['Variantes'] || []) {
      const [nomeV, muda] = Object.values(r);
      if (!nomes.slice(1).includes(nomeV)) continue;
      const f = {};
      const mpv = muda.match(/(?:^|;\s*)PV (\d+)/); if (mpv) f.pv = Number(mpv[1]);
      const mpe = muda.match(/(?:^|;\s*)Peso erguido: ([\d.,]+) kg/); if (mpe) f.pesoErguido = numBR(mpe[1]);
      const mt = muda.match(new RegExp(`(?:^|;\\s*)Tamanho: (${TAMANHOS})\\b`)); if (mt) f.tamanho = mt[1];
      const mfx = muda.match(/\(Faixa (\d)\)/); if (mfx) f.faixa = Number(mfx[1]);
      formas[slug(nomeV.replace(/^forma (de |d[ao] )?/, ''))] = f;
    }
  }
  return { esperado, ficha, formas, nao };
}

if (path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url))) {
const arquivos = fs.readdirSync(PASTA).filter((a) => a.endsWith('.md')).sort();
const criaturas = {};
let comParada = 0;
for (const a of arquivos) {
  const id = a.slice(0, -3), buf = fs.readFileSync(path.join(PASTA, a)), texto = buf.toString('utf8');
  const sp = path.join(SITE, `${id}.json`);
  const conv = converterFicha(texto, { site: fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, 'utf8')) : null });
  const { esperado, ficha, formas, nao } = lerEsperado(texto);
  const o = { sha256: crypto.createHash('sha256').update(buf).digest('hex'), entrada: escolhe(conv.criatura, CHAVES_MOTOR), esperado };
  if (Object.keys(ficha).length) o.ficha = ficha;
  const fo = {};
  for (const [fid, esp] of Object.entries(formas)) {
    const f = (conv.criatura.formas || []).find((x) => x.id === fid);
    if (f && Object.keys(esp).length) fo[fid] = { nome: f.nome, entrada: escolhe(f, CHAVES_MOTOR), esperado: esp };
  }
  if (Object.keys(fo).length) o.formas = fo;
  if (conv.paradas.length) { o.paradas = conv.paradas; comParada++; }
  if (nao.length) o.naoLido = nao;
  criaturas[id] = o;
}
const saida = {
  fonte: { pasta: 'tmp/arquiteto/bestiario/fichas-v3', data: new Date().toLocaleDateString('sv-SE'), fichas: arquivos.length, gerador: 'scripts/gen-criaturas-esperado.mjs' },
  criaturas,
};
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 1) + '\n');
const C = Object.values(criaturas);
const nAt = C.reduce((s, c) => s + c.esperado.ataques.length, 0), nJog = C.reduce((s, c) => s + c.esperado.ataques.filter((x) => x.jogada !== undefined).length, 0);
console.log(`criaturas-esperado.json: ${arquivos.length} fichas, ${nAt} ataques (${nJog} com a jogada escrita), ${comParada} com parada do conversor, ${C.filter((c) => c.naoLido).length} com número que não se leu`);
for (const [id, c] of Object.entries(criaturas)) if (c.naoLido) console.log(`  ${id}: ${c.naoLido.join('; ')}`);

}
