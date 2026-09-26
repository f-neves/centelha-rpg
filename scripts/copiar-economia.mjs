// Leva a saída do modelo da economia (lore/economia/v2/gerar.py) para os JSONs do site, com as
// transformações declaradas, e nada mais. Rodadas 110 e 111 (docs/simulacao/caixa/110-executora.md
// e 111-executora.md):
//   - a `_nota` de cada arquivo é reescrita (F5: diz que é saída do modelo; F6: a curva D na renda);
//   - mercadorias e montarias-veiculos, que são arrays, vão num envelope { _nota, itens } (F5);
//   - montarias-veiculos perde o `_procedencia` de cada item, que vai para
//     lore/economia/montarias.procedencia.json (F4);
//   - todo valor em dinheiro vira { por, preco: { pc } } (F2 estendida, rodada 111);
//   - mercadorias.procedencia.json vai como está para lore/economia/ e lore/economia/v2/.
//
// A FONTE É O MODELO, e não uma cópia dos JSONs gerados: o script roda o gerar.py numa pasta
// de trabalho do sistema, em os.tmpdir() (ele escreve em `out/`, relativo à pasta onde roda) e parte dessa saída. Assim o
// `--check` prova a cadeia inteira, modelo → gerar.py → este script → src/data, e pega tanto o JSON
// editado à mão quanto o modelo mudado sem gerar de novo.
//
//   node scripts/copiar-economia.mjs           · regera src/data e as procedências
//   node scripts/copiar-economia.mjs --check   · só confere (roda no `npm run validate`)
//
// Precisa de um Python 3 no PATH (`python3` ou `python`); o modelo só usa a biblioteca padrão.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const MODELO = path.join(RAIZ, 'lore/economia/v2');
const LORE = path.join(RAIZ, 'lore/economia');
const CHECK = process.argv.includes('--check');

// o Python: no Windows o `python3` costuma ser o atalho da loja, que não roda nada
function acharPython() {
  const cands = process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];
  for (const c of cands) {
    const r = spawnSync(c, ['-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === '3') return c;
  }
  console.error('✘ copiar-economia: nenhum Python 3 no PATH (tentei ' + cands.join(', ') + '). O modelo da economia precisa dele.');
  process.exit(1);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'economia-'));
for (const f of fs.readdirSync(MODELO)) if (f.endsWith('.py')) fs.copyFileSync(path.join(MODELO, f), path.join(tmp, f));
const py = spawnSync(acharPython(), ['gerar.py'], { cwd: tmp, encoding: 'utf8' });
if (py.status !== 0) { console.error('✘ copiar-economia: o gerar.py falhou\n' + py.stdout + py.stderr); process.exit(1); }
const V2 = path.join(tmp, 'out');
const ler = (f) => JSON.parse(fs.readFileSync(path.join(V2, f), 'utf8'));
const txt = (o) => JSON.stringify(o, null, 2) + '\n';
const F5 = 'Saída do modelo em lore/economia/v2/gerar.py: não edite preço à mão aqui; mude o modelo e gere de novo.';
const NOTAS = {
  'mercadorias.json': 'Mercadorias do mundo mundano, preço em cobre (pc): 193 itens em 12 categorias. ' + F5,
  'montarias-veiculos.json': 'Montarias, animais, arreios e veículos, preço em cobre (pc). Os animais não têm peso. A procedência de cada preço está em lore/economia/montarias.procedencia.json. ' + F5,
  'servicos.json': 'Preço de contratar. Diária por contrato = renda semanal / 6; avulsa x 1,5; hora = avulsa / jornada do ofício (leve 6 h, artesão 8 h, braçal 10 h). ' + F5,
  'pacotes-equipamento.json': 'Soma dos itens de mercadorias.json. Regra: um pacote de graça na criação (Diplomata exige Recursos 3) mais bolsa de 4 semanas de Livre. ' + F5,
  'renda.json': 'Renda por semana de trabalho (6 jornadas). Livre = Renda x 12% x (60/Renda)^0,35 (curva D: 12% no braçal, 2% na nobreza), arredondado. Custo = Renda - Livre; inclui o estilo de vida obrigatório da faixa. ' + F5,
  'custo-de-vida.json': 'Semana de Uldun (8 dias). Cestas por adulto-equivalente (Allen). Criança = meio adulto-equivalente. ' + F5,
  'viagens.json': 'Distâncias em km. ' + F5,
};
// ---------------------------------------------------------------- F2 estendida (rodada 111)
// Todo valor em dinheiro vira { preco: { pc }, por }, com `por` do vocabulário do despacho da 111
// (dia, hora, jornada, semana, km, 10 km, trajeto, vez, página, unidade) mais os que não cabiam:
// mes e ano (renda), ponto (aula). O que a unidade de hoje tinha além do tempo vai para campo
// próprio: `regime` (contrato/avulso), `oficio` (leve/artesao/bracal), `nota` (o resto do texto).
const P = (pc, por, extra = {}) => ({ por, ...extra, preco: pc == null ? null : { pc } });
const pc = (n) => (n == null ? null : { pc: n });
const UNID_SERVICO = {
  'dia (avulso)': { por: 'dia', regime: 'avulso' }, dia: { por: 'dia' }, hora: { por: 'hora' }, semana: { por: 'semana' },
  jornada: { por: 'jornada' }, 'página': { por: 'página' }, vez: { por: 'vez' },
  muda: { por: 'vez' }, carta: { por: 'unidade' }, documento: { por: 'unidade' }, atendimento: { por: 'vez' },
  consulta: { por: 'vez' }, parto: { por: 'vez' }, missa: { por: 'vez' }, 'cerimônia': { por: 'vez' },
  noite: { por: 'vez' }, 'apresentação': { por: 'vez' }, cavalo: { por: 'unidade' },
};
const UNID_VIAGEM = {
  '10 km': { por: '10 km' }, dia: { por: 'dia' },
  '10 km (rio abaixo); x2 rio acima': { por: '10 km', nota: 'rio abaixo; x2 rio acima' },
  'tonelada por km': { por: 'km', nota: 'por tonelada' }, '2 toneladas por km': { por: 'km', nota: 'por 2 toneladas' },
  'trajeto curto': { por: 'trajeto', nota: 'curto' },
  'pessoa; 5 com cavalo': { por: 'vez', nota: 'por pessoa; 5 com cavalo' },
  'pessoa; 3 por animal; 10 por carroça': { por: 'vez', nota: 'por pessoa; 3 por animal; 10 por carroça' },
};
const unid = (mapa, u, onde) => { if (!mapa[u]) throw new Error(`${onde}: unidade sem mapa "${u}"`); return mapa[u]; };
const criado = (c) => ({ id: c.id, nome: c.nome, salario: P(c.salario_semana, 'semana'), custo_total: P(c.custo_total_semana, 'semana') });
function f2(f, o) {
  if (f === 'servicos.json') return {
    _nota: o._nota,
    tarifas_por_perfil: o.tarifas_por_perfil.map((t) => ({ perfil: t.perfil, soma: t.soma, tarifas: [
      P(t.semana, 'semana'), P(t.contrato, 'dia', { regime: 'contrato' }), P(t.avulsa, 'dia', { regime: 'avulso' }),
      P(t.hora_leve, 'hora', { oficio: 'leve' }), P(t.hora_artesao, 'hora', { oficio: 'artesao' }), P(t.hora_bracal, 'hora', { oficio: 'bracal' }),
    ] })),
    servicos: o.servicos.map((s) => {
      const u = unid(UNID_SERVICO, s.unidade, `servicos.${s.id}`);
      const texto = typeof s.pc === 'string';
      if (texto && s.pc !== 'ver aulas') throw new Error(`servicos.${s.id}: preço em texto não previsto "${s.pc}"`);
      return { grupo: s.grupo, id: s.id, nome: s.nome, ...u, preco: texto ? null : pc(s.pc), calculado: pc(s.pc_calculado), base: s.base, ...(texto ? { ver: 'aulas' } : {}) };
    }),
    aulas: o.aulas.map((a) => ({ tipo: a.tipo, novo: a.novo, xp: a.xp, jornadas: a.jornadas, prof_soma: a.prof_soma, por: 'ponto', preco: pc(a.pc), calculado: pc(a.preco) })),
    criados: o.criados.map(criado),
    escravos: o.escravos.map((e) => ({ nome: e.nome, por: 'unidade', preco: pc(e.pc), catalogo_anterior: pc(e.pc_catalogo_atual) })),
    escravo_sustento: P(o.escravo_sustento_semana, 'semana'),
  };
  if (f === 'viagens.json') return { ...o, precos: o.precos.map((p) => ({ id: p.id, nome: p.nome, ...unid(UNID_VIAGEM, p.unidade, `viagens.${p.id}`), preco: pc(p.pc) })) };
  if (f === 'custo-de-vida.json') {
    const nomeado = (d) => Object.fromEntries(Object.entries(d).map(([k, v]) => [k, { nome: v.nome, ...P(v.pc, 'semana') }]));
    return {
      _nota: o._nota,
      niveis_pessoa: o.niveis_pessoa.map((n) => ({ nivel: n.nivel, composicao: n.composicao, custo: P(n.pc_semana, 'semana'), estalagem: n.estalagem_semana == null ? null : P(n.estalagem_semana, 'semana') })),
      cestas: nomeado(o.cestas_semana),
      moradias: nomeado(o.moradia_semana),
      criados: o.criados.map(criado),
      manutencao_cavalo: P(o.cavalo_manutencao_semana, 'semana'),
      manutencao_cavalo_guerra: P(o.cavalo_guerra_manutencao_semana, 'semana'),
      pacotes_familia: Object.fromEntries(Object.entries(o.pacotes_familia).map(([k, p]) => [k, {
        itens: p.itens.map((i) => ({ item: i.item, ...P(i.pc_semana, 'semana') })),
        pacote: P(p.pacote, 'semana'), estilo_de_vida: P(p.estilo_de_vida, 'semana'),
      }])),
    };
  }
  if (f === 'renda.json') {
    const tri = (s, m, a) => [P(s, 'semana'), P(m, 'mes'), P(a, 'ano')];
    return {
      _nota: o._nota,
      faixas: o.faixas.map((x) => ({ faixa: x.faixa, recursos: x.recursos, renda: tri(x.renda_semana, x.renda_mes, x.renda_ano), livre: tri(x.livre_semana, x.livre_mes, x.livre_ano), custo: [P(x.custo_semana, 'semana')], nivel_de_vida: x.nivel_de_vida, origem: x.origem })),
      curva_por_soma: o.curva_por_soma.map((c) => ({ soma: c.soma, media: c.media, renda: P(c.renda_semana, 'semana'), faixa_dificuldade: c.faixa_dificuldade })),
      valor_por_ponto: Object.fromEntries(Object.entries(o.valor_por_ponto_semana).map(([k, v]) => [k, P(v, 'semana')])),
      tetos_demanda: Object.fromEntries(Object.entries(o.tetos_demanda_semana).map(([k, v]) => [k, P(v, 'semana')])),
    };
  }
  if (f === 'pacotes-equipamento.json') return { _nota: o._nota, pacotes: Object.fromEntries(Object.entries(o.pacotes).map(([k, p]) => [k, { total: pc(p.total_pc), total_anterior: pc(p.total_atual_pc), itens: p.itens }])) };
  return o;
}

const saida = {};
const procMontarias = { _nota: 'Procedência dos preços de montarias-veiculos.json (tirada do arquivo do site na rodada 110, F4). Lore, não dado de jogo.', itens: [] };
for (const [f, nota] of Object.entries(NOTAS)) {
  const src = ler(f);
  let out;
  if (Array.isArray(src)) {
    let itens = src;
    if (f === 'montarias-veiculos.json') {
      itens = src.map(({ _procedencia, ...resto }) => { procMontarias.itens.push({ id: resto.id, ..._procedencia }); return resto; });
    }
    out = { _nota: nota, itens };
  } else {
    if (typeof src._nota !== 'string') throw new Error(f + ': objeto sem _nota na saída do modelo');
    out = { ...src, _nota: nota }; // a _nota já é a 1ª chave na saída do modelo, e continua sendo
  }
  saida[path.join(RAIZ, 'src/data', f)] = txt(f2(f, out));
}
saida[path.join(LORE, 'montarias.procedencia.json')] = txt(procMontarias);
const procMerc = fs.readFileSync(path.join(V2, 'mercadorias.procedencia.json'), 'utf8');
saida[path.join(LORE, 'mercadorias.procedencia.json')] = procMerc;
saida[path.join(LORE, 'v2/mercadorias.procedencia.json')] = procMerc;
fs.rmSync(tmp, { recursive: true, force: true }); // a pasta de trabalho em os.tmpdir(), criada acima

const rel = (p) => path.relative(RAIZ, p).split(path.sep).join('/');
const diferem = [];
for (const [p, t] of Object.entries(saida)) {
  if (CHECK) { if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== t) diferem.push(rel(p)); }
  else fs.writeFileSync(p, t);
}
if (CHECK) {
  if (diferem.length) {
    console.error(`✘ a economia do site está fora de sincronia com o modelo (lore/economia/v2): ${diferem.join(', ')}.\n`
      + '  Não edite esses JSONs à mão: mude o modelo e rode node scripts/copiar-economia.mjs');
    process.exit(1);
  }
  console.log(`✓ economia do site em dia com o modelo (${Object.keys(saida).length} arquivos, refeitos a partir do gerar.py)`);
} else console.log(`economia regerada a partir do modelo: ${Object.keys(saida).map(rel).join(', ')}`);
