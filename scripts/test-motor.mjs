// test-motor.mjs · o motor único (src/lib/motor.ts) contra os números conferidos das fichas (plano-conversao.md, A1 e A2).
//
// O QUE ISTO GUARDA. As fichas .md de criatura escrevem os números que o conferidor da Bestiarista confere (PV, Defesas,
// Absorção, peso erguido, Tamanho, faixa, Energia, Iniciativa, Mana e, por ataque, a jogada, o dano médio e a
// Velocidade). O gen-criaturas-esperado.mjs os copia para scripts/fixtures/criaturas-esperado.json junto com as entradas,
// e este teste pede cada conta ao motor e compara número por número. Acusa a criatura, a conta e os dois números.
// Uma diferença só se aceita com o motivo escrito em ACEITAS, abaixo.
//
// O jogador também tem números esperados, escritos aqui com a procedência (D-234; plano-conversao.md, seção 0).
//
// O CONTRATO que o motor cumpre (o teste foi escrito antes dele, e começa vermelho):
//   criatura(entrada)       → { pv, pesoErguido, faixa, tamanho, segundoTamanho, esquiva, bloqueio, defesaMental,
//                               defesaSocial, iniciativa, energia, mana, absorcao: {impacto, corte, perfuracao},
//                               comEquipamento, ataques: [{ nome, velocidade, danoMedio, jogada }] }
//                             o Tamanho é o id (`medio`), a Defesa de Inteligência 0 é 'imune', a Mana de quem não tem
//                             Arte é null, e a `jogada` inclui o `acerto` do ataque;
//   tamanhosDaArea(area)    → os ids que a área aceita, o do corte primeiro e, a menos de 5% dele, o vizinho
//                             (decisoes-autor §13); a entrada guarda `corpo.tamanhoEscolhido` só quando a ficha
//                             ficou com o vizinho;
//   comForma(entrada, muda) → a entrada da forma, montada por cima da principal (D-217);
//   personagem(ficha)       → { pv, pesoErguido }, com a raça, os Atributos, as Habilidades e a `corpo.massa`.
//
//   node scripts/test-motor.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIX = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/fixtures/criaturas-esperado.json'), 'utf8'));
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

// As diferenças aceitas, uma por `id.conta`, cada uma com o motivo. Cada uma é defeito ou dúvida da FICHA, e não do
// motor, e está em tmp/executora/fase3/perguntas.md para o Arquiteto; a entrada sai daqui quando a ficha se corrigir.
// A lista encolhe com o problema: a entrada que não foi usada nesta execução também falha.
const SEM_SOCIABILIDADE = 'a Defesa Social da ficha usa Sociabilidade 1, e a tabela Habilidades não tem a linha: o motor lê 0 (perguntas.md, P3)';
// P4, 26/10/2026: números antigos das fichas que aguardam lote de ajuste da Bestiarista.
// Pares [ficha antiga, motor aprovado], sem alterar nenhuma ficha. A entrada sai quando o lote chega.
const SOCIAL_P4 = {
  "ankheg": [
    4,
    14
  ],
  "basilisco": [
    6,
    18
  ],
  "behir": [
    6,
    14
  ],
  "bulette": [
    4,
    12
  ],
  "buscador": [
    2,
    8
  ],
  "cao-de-guerra-nessiano": [
    4,
    16
  ],
  "cao-infernal": [
    4,
    14
  ],
  "cao-yeth": [
    6,
    16
  ],
  "cocatriz": [
    4,
    12
  ],
  "corujurso": [
    4,
    10
  ],
  "diabo-barbado": [
    8,
    4
  ],
  "dretch": [
    4,
    8
  ],
  "elemental-da-agua-pequeno": [
    4,
    8
  ],
  "elemental-da-terra-grande": [
    4,
    8
  ],
  "elemental-da-terra-pequeno": [
    4,
    8
  ],
  "elemental-do-ar-pequeno": [
    4,
    8
  ],
  "elemental-do-fogo-pequeno": [
    4,
    8
  ],
  "estrangulador": [
    4,
    8
  ],
  "ettercap": [
    6,
    16
  ],
  "ettin": [
    4,
    8
  ],
  "froghemoth": [
    6,
    10
  ],
  "girallon": [
    4,
    12
  ],
  "gorgona-touro-de-ferro": [
    6,
    18
  ],
  "hidra-5-cabecas": [
    4,
    12
  ],
  "hipogrifo": [
    4,
    12
  ],
  "lagarto-eletrico": [
    4,
    12
  ],
  "manto-escuro": [
    4,
    10
  ],
  "minotauro": [
    4,
    10
  ],
  "monstro-da-ferrugem": [
    4,
    10
  ],
  "morlock": [
    4,
    12
  ],
  "ogro": [
    4,
    6
  ],
  "otyugh": [
    4,
    12
  ],
  "quimera": [
    6,
    18
  ],
  "remorhaz": [
    4,
    16
  ],
  "serpente-marinha": [
    4,
    16
  ],
  "stirge": [
    4,
    10
  ],
  "tarrasque": [
    8,
    20
  ],
  "trol": [
    4,
    8
  ],
  "verme-purpura": [
    4,
    12
  ],
  "worg": [
    6,
    14
  ]
};
const ACEITAS = {
  'bralani.defesaSocial': SEM_SOCIABILIDADE,
  'centauro.defesaSocial': SEM_SOCIABILIDADE,
  'janni.defesaSocial': SEM_SOCIABILIDADE,
  'homem-lagarto.defesaSocial': SEM_SOCIABILIDADE,
};

async function carregarMotor() {
  const fonte = path.join(ROOT, 'src/lib/motor.ts');
  if (!fs.existsSync(fonte)) return null;
  const saida = path.join(os.tmpdir(), `motor-test-${process.pid}.mjs`);
  await build({
    entryPoints: [fonte], outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error', define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  globalThis.__ENV__ = globalThis.__ENV__ || { BASE_URL: '/', MODE: 'test' };
  try { return await import(pathToFileURL(saida).href); } finally { try { fs.unlinkSync(saida); } catch { /* o sistema limpa */ } }
}

const M = await carregarMotor();
if (!M) {
  console.log('✘ test-motor: src/lib/motor.ts não existe (o A2 o escreve); nenhuma das '
    + `${Object.keys(FIX.criaturas).length} criaturas do criaturas-esperado.json foi conferida`);
  process.exit(1);
}

const falhas = [], aceitas = [];
let contas = 0;
const confere = (id, conta, vem, deve, tol = 0) => {
  contas++;
  const igual = typeof deve === 'number' && typeof vem === 'number' ? Math.abs(vem - deve) <= tol : vem === deve;
  if (igual) return;
  const chave = `${id}.${conta}`;
  if (conta === 'defesaSocial' && SOCIAL_P4[id]?.[0] === deve && SOCIAL_P4[id]?.[1] === vem) { aceitas.push(chave + ' (P4: espera lote de ajuste)'); return; }
  if (ACEITAS[chave]) { aceitas.push(chave); return; }
  falhas.push({ id, conta, vem, deve });
};
// o peso erguido da ficha vem com duas casas, e o conferidor confere a 1% (GUIA-FICHA.md, seção 7)
const tolPeso = (p) => Math.max(0.02, Math.abs(p) * 0.01);

for (const [id, c] of Object.entries(FIX.criaturas)) {
  // a entrada é a que o conversor escreve, com as escolhas da ficha (o Tamanho perto do corte, a linha de PV na zona)
  const e = c.entrada, x = c.esperado;
  const r = M.criatura(e);
  if (c.ficha?.enxame) aceitas.push(`${id}.pv (o enxame não tem formato: formato-criatura.md, fim da seção 4)`);
  else confere(id, 'pv', r.pv, x.pv);
  if (x.pesoErguido === null) confere(id, 'pesoErguido', r.pesoErguido, null);
  else if (x.pesoErguido !== undefined) confere(id, 'pesoErguido', r.pesoErguido, x.pesoErguido, tolPeso(x.pesoErguido));
  confere(id, 'faixa', r.faixa, x.faixa);
  if (x.tamanho) confere(id, 'tamanho', r.tamanho, slug(x.tamanho));
  if (x.segundoTamanho) confere(id, 'segundoTamanho', r.segundoTamanho, slug(x.segundoTamanho));
  for (const k of ['esquiva', 'bloqueio', 'defesaMental', 'defesaSocial', 'iniciativa', 'energia', 'mana']) if (k in x) confere(id, k, r[k], x[k]);
  for (const [k, v] of Object.entries(x.absorcao || {})) confere(id, `absorcao.${k}`, r.absorcao?.[k], v);
  for (const [k, v] of Object.entries(x.comEquipamento || {})) confere(id, `comEquipamento.${k}`, r.comEquipamento?.[k], v);
  for (const a of x.ataques) {
    const ra = r.ataques.find((y) => y.nome === a.nome);
    if (!ra) { falhas.push({ id, conta: `ataque ${a.nome}`, vem: 'ausente', deve: 'presente' }); continue; }
    if (a.velocidade !== undefined) confere(id, `${a.nome}.velocidade`, ra.velocidade, a.velocidade);
    if (a.danoMedio !== undefined) confere(id, `${a.nome}.danoMedio`, ra.danoMedio, a.danoMedio);
    // a frase "Jogada:" da ficha soma o Atributo, a Habilidade e a Centelha, sem o Acerto da coluna
    if (a.jogada !== undefined) confere(id, `${a.nome}.jogada`, ra.jogada - (ra.acerto || 0), a.jogada);
  }
  for (const [fid, fo] of Object.entries(c.formas || {})) {
    const rf = M.criatura(M.comForma(c.entrada, fo.entrada));
    for (const [k, v] of Object.entries(fo.esperado)) {
      if (k === 'pesoErguido') confere(id, `formas.${fid}.${k}`, rf[k], v, tolPeso(v));
      else confere(id, `formas.${fid}.${k}`, rf[k], k === 'tamanho' ? slug(v) : v);
    }
  }
}

// P4: o critério é Inteligência, inclusive fora dos animais; Int 0 continua imune.
for (const categoria of ['animal', 'fera-magica', 'humanoide']) {
  const base = structuredClone(FIX.criaturas.grifo.entrada);
  base.categoria = categoria; base.centelha = 2; base.atributos.compostura = 2;
  base.habilidades.sobrevivencia = 3; base.habilidades.sociabilidade = 1;
  for (const [inteligencia, esperado] of [[0, 'imune'], [1, 14], [2, categoria === 'animal' ? 14 : 8]]) {
    base.atributos.inteligencia = inteligencia;
    confere('P4 ' + categoria, 'Int ' + inteligencia, M.criatura(base).defesaSocial, esperado);
  }
}

// O jogador (D-234): o PV pelo Tamanho da raça, e não pela massa; o peso erguido pela massa (a R15, D-184).
const pessoa = (raca, vigor, massa, extra = {}) => ({
  raca, atributos: { forca: 3, destreza: 3, vigor, percepcao: 3, inteligencia: 3, raciocinio: 3, influencia: 3, perspicacia: 3, compostura: 3, ...extra.atributos },
  habilidadesSec: extra.habilidadesSec || {}, corpo: { massa },
});
const JOGADOR = [
  // "um elfo de 25 kg continua Médio" (D-234): a linha do Médio, 25 + Vigor × 3
  ['elfo de 25 kg, Vigor 3', pessoa('elfo', 3, 25), 'pv', 34],
  // "um gnomo de 50 kg continua Pequeno" (D-234): a linha do Pequeno, 20 + Vigor × 2 (racas.md:76)
  ['gnomo de 50 kg, Vigor 3', pessoa('gnomo', 3, 50), 'pv', 26],
  // "um orc de 500 kg continua Médio" (D-234), com a Vitalidade por cima (+ Vigor, racas.json; racas.md:113,129)
  ['orc de 500 kg, Vigor 3', pessoa('orc', 3, 500), 'pv', 37],
  // o peso erguido muda com a massa: humano de Força 6 e Halterofilismo 6, de 299 a 354 kg com 60 a 80 kg (plano, seção 0)
  ['humano de 60 kg, Força 6, Halterofilismo 6', pessoa('humano', 3, 60, { atributos: { forca: 6 }, habilidadesSec: { halterofilismo: 6 } }), 'pesoErguido', 299.1],
  ['humano de 80 kg, Força 6, Halterofilismo 6', pessoa('humano', 3, 80, { atributos: { forca: 6 }, habilidadesSec: { halterofilismo: 6 } }), 'pesoErguido', 354.03],
  // o exemplo do guia: soldado veterano de 82 kg, Força 3, Halterofilismo 1, P = 143,31 kg (GUIA-FICHA.md, seção 7)
  ['soldado de 82 kg, Força 3, Halterofilismo 1', pessoa('humano', 3, 82, { habilidadesSec: { halterofilismo: 1 } }), 'pesoErguido', 143.31],
];
for (const [quem, ficha, conta, deve] of JOGADOR) {
  const r = M.personagem(ficha);
  confere(`jogador (${quem})`, conta, r[conta], deve, conta === 'pesoErguido' ? tolPeso(deve) : 0);
}

// a tabela de Vida mora duas vezes em regras.json: o texto que a mesa mostra (`linhas`) e os números que o motor lê
// (`conta`); as duas têm de dizer o mesmo, linha por linha, pelo exemplo de Vigor 3 que o texto já traz
{
  const RG = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8')).derivados.pv.massa;
  if (RG.linhas.length !== RG.conta.length) falhas.push({ id: 'regras.json', conta: 'derivados.pv.massa: linhas e conta', vem: RG.conta.length, deve: RG.linhas.length });
  RG.linhas.forEach((l, i) => {
    const k = RG.conta[i];
    if (k) confere('regras.json', `derivados.pv.massa, linha ${i + 1} (${l.massa}) com Vigor 3`, k.base + Math.floor((3 * k.vigorMult) / k.vigorDivisor), l.comVigor3);
  });
}
const nC = Object.keys(FIX.criaturas).length;
for (const k of Object.keys(ACEITAS)) if (!aceitas.includes(k)) falhas.push({ id: k, conta: 'ACEITAS sem uso (a diferença sumiu: tire a entrada)', vem: 'igual', deve: 'diferente' });
if (falhas.length) {
  const porConta = {};
  for (const x of falhas) { const k = x.conta.replace(/^.*\.(velocidade|danoMedio|jogada)$/, 'ataque.$1').replace(/^formas\.[^.]+\./, 'formas.'); (porConta[k] ??= []).push(x); }
  console.log(`✘ test-motor: ${falhas.length} diferença(s) em ${contas} contas de ${nC} criaturas e ${JOGADOR.length} jogadores`);
  for (const [k, l] of Object.entries(porConta).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  · ${k}: ${l.length}`);
    for (const x of l.slice(0, 5)) console.log(`      ${x.id}, ${x.conta}: o motor dá ${JSON.stringify(x.vem)}, a ficha diz ${JSON.stringify(x.deve)}`);
  }
  process.exit(1);
}
console.log(`✓ test-motor · ${contas} contas de ${nC} criaturas e ${JOGADOR.length} jogadores batem com as fichas`
  + (aceitas.length ? ` · ${aceitas.length} aceitas com motivo` : ''));
