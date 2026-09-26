// Regera as tabelas da economia mundana no capítulo `custo-de-servico-e-itens.md` a partir dos
// JSONs de src/data que saem do modelo de lore/economia/v2/gerar.py: renda.json,
// custo-de-vida.json, servicos.json, mercadorias.json, montarias-veiculos.json, viagens.json e
// pacotes-equipamento.json.
//
// POR QUE. As tabelas eram escritas à mão, e a revisão econômica (rodada 110) trocou quase todos os
// números. Tabela à mão ao lado de JSON descola na primeira mudança; é a mesma disciplina do
// catálogo de perícias e do catálogo de equipamento (gen-cap-itens.mjs): o capítulo só reflete.
//
// O script reescreve só o miolo entre os marcadores
//   <!-- gen:economia-<bloco> --> … <!-- /gen:economia-<bloco> -->
// e não toca em mais nada da página. O texto em volta de cada bloco é escrito à mão.
//
//   node scripts/gen-cap-economia.mjs          · regera
//   node scripts/gen-cap-economia.mjs --check  · só confere (roda no `npm run validate`)
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(raiz, 'src/data', p), 'utf8'));
const CAP = path.join(raiz, 'src/content/chapters/custo-de-servico-e-itens.md');

const RENDA = ler('renda.json');
const VIDA = ler('custo-de-vida.json');
const SERV = ler('servicos.json');
const MERC = ler('mercadorias.json').itens;
const MONT = ler('montarias-veiculos.json').itens;
const VIAG = ler('viagens.json');
const PAC = ler('pacotes-equipamento.json').pacotes;

const milhar = (n) => n.toLocaleString('pt-BR');
// cobre → a maior moeda exata (po/pp/pc), como no catálogo de equipamento; acima de 1 po sem moeda
// exata, a forma mista; fração de cobre com vírgula.
function fmt(pc) {
  if (pc == null) return '·';
  if (!Number.isInteger(pc)) return `${String(Math.round(pc * 10) / 10).replace('.', ',')} pc`;
  if (pc === 0) return '0';
  if (pc % 100 === 0) return `${milhar(pc / 100)} po`;
  if (pc % 10 === 0 && pc < 100) return `${pc / 10} pp`;
  if (pc >= 100) return fmtMisto(pc);
  return `${pc} pc`;
}
// cobre → forma mista "X po Y pp Z pc".
function fmtMisto(pc) {
  const po = Math.floor(pc / 100), pp = Math.floor((pc % 100) / 10), c = pc % 10;
  return [po && `${milhar(po)} po`, pp && `${pp} pp`, c && `${c} pc`].filter(Boolean).join(' ') || '0';
}
const num = (n) => String(n).replace('.', ',');
const bolas = (n) => '●'.repeat(n);
const tabela = (cab, alin, linhas) => [
  `| ${cab.join(' | ')} |`,
  `|${alin.map((a) => (a === 'c' ? ':---:' : '---')).join('|')}|`,
  ...linhas.map((l) => `| ${l.join(' | ')} |`),
].join('\n');
const envolve = (t) => `<div class="table-wrap">\n\n${t}\n\n</div>`;

const blocos = {};

// ----------------------------------------------------------------- renda
blocos.renda = envolve(tabela(
  ['Recursos', 'Faixa', 'Renda/Sem', 'Renda/Mês', 'Livre/Sem', 'Livre/Mês', 'Livre/Ano', 'Custo/Sem', 'Nível de vida'],
  ['c', 'l', 'c', 'c', 'c', 'c', 'c', 'c', 'l'],
  RENDA.faixas.map((f) => [bolas(f.recursos), f.faixa, fmt(f.renda_semana), fmt(f.renda_mes), fmt(f.livre_semana), fmt(f.livre_mes), fmt(f.livre_ano), fmt(f.custo_semana), f.nivel_de_vida]),
));

// ------------------------------------------------------------ custo de vida
blocos['custo-de-vida'] = envolve(tabela(
  ['Nível de vida', 'Por semana', 'O que compra', 'Na estalagem (semana)'],
  ['l', 'c', 'l', 'c'],
  VIDA.niveis_pessoa.map((n) => [n.nivel, fmt(n.pc_semana), n.composicao, n.estalagem_semana == null ? 'não se hospeda' : fmt(n.estalagem_semana)]),
));
const custoDaFaixa = Object.fromEntries(RENDA.faixas.map((f) => [f.faixa, f.custo_semana]));
blocos['pacote-familia'] = envolve(tabela(
  ['Faixa', 'Custo/Sem', 'Pacote básico', 'Estilo de vida', 'O que o pacote cobre'],
  ['l', 'c', 'c', 'c', 'l'],
  Object.entries(VIDA.pacotes_familia).map(([faixa, p]) => [faixa, fmt(custoDaFaixa[faixa]), fmt(Math.round(p.pacote)), fmt(Math.round(p.estilo_de_vida)),
    p.itens.map((i) => `${i.item} (${fmt(Math.round(i.pc_semana))})`).join('; ')]),
));

// --------------------------------------------------------------- serviços
blocos.tarifas = envolve(tabela(
  ['Perfil', 'Soma', 'Renda/Sem', 'Diária (contrato)', 'Diária avulsa', 'Hora, serviço leve', 'Hora, artesão', 'Hora, braçal'],
  ['l', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  SERV.tarifas_por_perfil.map((t) => [t.perfil, t.soma, fmt(t.semana), fmt(t.contrato), fmt(t.avulsa), fmt(t.hora_leve), fmt(t.hora_artesao), fmt(t.hora_bracal)]),
));
const grupos = [...new Set(SERV.servicos.map((s) => s.grupo))];
blocos.servicos = grupos.map((g) => `<p class="cat-cap">${g}</p>\n\n` + envolve(tabela(
  ['Serviço', 'Unidade', 'Preço'], ['l', 'l', 'c'],
  SERV.servicos.filter((s) => s.grupo === g).map((s) => [s.nome, s.unidade, typeof s.pc === 'number' ? fmt(s.pc) : s.pc]),
))).join('\n\n');
blocos.aulas = envolve(tabela(
  ['O que se aprende', 'Nível novo', 'XP', 'Jornadas de aula', 'Professor (soma)', 'Preço'],
  ['l', 'c', 'c', 'c', 'c', 'c'],
  SERV.aulas.map((a) => [a.tipo, a.novo, a.xp, num(a.jornadas), a.prof_soma, fmt(a.pc)]),
));

// ----------------------------------------------------------- servos e escravos
blocos.criados = envolve(tabela(
  ['Criado', 'Salário/Sem', 'Custo total/Sem'], ['l', 'c', 'c'],
  SERV.criados.map((c) => [c.nome, fmt(c.salario_semana), fmt(c.custo_total_semana)]),
));
blocos.escravos = envolve(tabela(
  ['Escravo', 'Preço'], ['l', 'c'],
  [...SERV.escravos.map((e) => [e.nome, fmt(e.pc)]), ['Sustento (por semana)', fmt(SERV.escravo_sustento_semana)]],
));

// ------------------------------------------------------------- mercadorias
const CATEGORIA = {
  graos: 'Grãos e pão', alimentos: 'Alimentos', bebidas: 'Bebidas', temperos: 'Temperos e doces',
  'materia-prima': 'Matéria-prima', roupas: 'Roupas', casa: 'Casa', utensilios: 'Utensílios',
  luz: 'Luz e fogo', ferramentas: 'Ferramentas', aventura: 'Aventura', escrita: 'Escrita',
};
const cats = [...new Set(MERC.map((m) => m.mercadoria.categoria))];
for (const c of cats) if (!CATEGORIA[c]) throw new Error(`categoria sem rótulo em gen-cap-economia.mjs: ${c}`);
blocos.mercadorias = cats.map((c) => `<p class="cat-cap">${CATEGORIA[c]}</p>\n\n` + envolve(tabela(
  ['Item', 'Unidade', 'Preço'], ['l', 'l', 'c'],
  MERC.filter((m) => m.mercadoria.categoria === c).map((m) => [m.nome, m.mercadoria.unidade, fmt(m.preco.pc)]),
))).join('\n\n');

// --------------------------------------------------- montarias, animais, veículos
const TIPO = { montaria: 'Montarias e animais de trabalho', animal: 'Animais de criação', arreio: 'Arreios e cuidados', veiculo: 'Veículos e barcos' };
const tipos = [...new Set(MONT.map((m) => m.tipo))];
for (const t of tipos) if (!TIPO[t]) throw new Error(`tipo sem rótulo em gen-cap-economia.mjs: ${t}`);
blocos.montarias = tipos.map((t) => `<p class="cat-cap">${TIPO[t]}</p>\n\n` + envolve(tabela(
  ['Item', 'Preço'], ['l', 'c'],
  MONT.filter((m) => m.tipo === t).map((m) => [m.nome, fmt(m.preco.pc)]),
))).join('\n\n') + `\n\n<p class="muted">Manter um cavalo custa <strong>${fmt(VIDA.cavalo_manutencao_semana)}</strong> por semana (ração, estábulo, ferragem); um cavalo de guerra, <strong>${fmt(VIDA.cavalo_guerra_manutencao_semana)}</strong>.</p>`;

// ------------------------------------------------------------------ viagens
blocos.viagens = envolve(tabela(
  ['Como se viaja', 'km por dia'], ['l', 'c'],
  VIAG.velocidades_km_dia.map((v) => [v.modo, v.km_dia]),
)) + '\n\n' + envolve(tabela(
  ['Passagem, aluguel e frete', 'Preço', 'Por'], ['l', 'c', 'l'],
  VIAG.precos.map((p) => [p.nome, fmt(p.pc), p.unidade]),
));

// ------------------------------------------------------------------ pacotes
const porId = Object.fromEntries(MERC.map((m) => [m.id, m]));
blocos.pacotes = Object.entries(PAC).map(([nome, p]) => {
  const itens = p.itens.map(([id, q]) => { const m = porId[id]; if (!m) throw new Error(`pacote ${nome}: item ${id} não existe em mercadorias.json`); return q > 1 ? `${m.nome} ×${q}` : m.nome; });
  return `- **${nome} (${fmtMisto(p.total_pc)})**: ${itens.join(', ')}.`;
}).join('\n');

// ------------------------------------------------------------------ escrever
const montar = () => {
  let md = fs.readFileSync(CAP, 'utf8');
  for (const [b, corpo] of Object.entries(blocos)) {
    const marca = `economia-${b}`;
    const re = new RegExp(`(<!-- gen:${marca} -->)[\\s\\S]*?(<!-- /gen:${marca} -->)`);
    if (!re.test(md)) throw new Error(`marcador gen:${marca} não encontrado em ${CAP}`);
    md = md.replace(re, () => `<!-- gen:${marca} -->\n\n${corpo}\n\n<!-- /gen:${marca} -->`);
  }
  return md;
};
const resumo = `${Object.keys(blocos).length} blocos: ${RENDA.faixas.length} faixas de renda, ${MERC.length} mercadorias, ${MONT.length} montarias e veículos, ${SERV.servicos.length} serviços, ${Object.keys(PAC).length} pacotes`;

if (process.argv.includes('--check')) {
  if (fs.readFileSync(CAP, 'utf8') !== montar()) {
    console.error(`✘ ${path.relative(raiz, CAP)} está fora de sincronia com a economia (marcadores gen:economia-*).\n`
      + '  Rode: node scripts/gen-cap-economia.mjs');
    process.exit(1);
  }
  console.log(`✓ tabelas da economia em dia com a fonte (${resumo})`);
  process.exit(0);
}
fs.writeFileSync(CAP, montar());
console.log(`economia regerada: ${resumo}`);
