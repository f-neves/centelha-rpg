// Leva a saída do modelo da economia (lore/economia/v2/gerar.py) para os JSONs do site, com as
// transformações declaradas, e nada mais. Rodadas 110 a 112 (docs/simulacao/caixa/110-executora.md,
// 111-executora.md e 112-executora.md):
//   - a `_nota` de cada arquivo é reescrita (F5: diz que é saída do modelo; F6: a curva D na renda);
//   - mercadorias e montarias-veiculos, que são arrays, vão num envelope { _nota, itens } (F5);
//   - montarias-veiculos perde o `_procedencia` de cada item, que vai para
//     lore/economia/montarias.procedencia.json (F4);
//   - mercadorias.procedencia.json vai como está para lore/economia/ e lore/economia/v2/.
// A forma de todo valor em dinheiro, { por, preco: { pc } } (F2, rodadas 111 e 112), vem pronta do
// gerar.py: este script não inventa forma nenhuma.
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
  'recompensas.json': 'Recompensa de caça: Bolsa = Valor do degrau × Semanas × Tarefa × Risco × 3 (o grupo de referência); degrau = desafio + quantidade + Centelha ÷ 4; o valor do degrau é a tarifa de base por caçador, por semana, base × fator^(degrau − 1), arredondado pela régua em `arredondamento` (a mesma do `arred` de lore/economia/v2/base.py). ' + F5,
};
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
  saida[path.join(RAIZ, 'src/data', f)] = txt(out);
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
