// Regera as tabelas da economia mundana nos capítulos `custo-de-servico-e-itens.md` e (a curva de
// ganhar a vida com o ofício, rodada 113) `acoes-oficio-e-mundo.md`, a partir dos
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

// Os valores em dinheiro vêm como { por, preco: { pc } } (F2, rodada 111). `de` acha num array o valor
// daquela unidade (e, se pedido, daquele regime ou ofício), e falha alto se não houver exatamente um.
// Preço que falta é defeito, e não "·": falha alto (veredito da Revisora na 111, §4).
const pcDe = (v) => { if (!v || !v.preco) throw new Error(`valor sem preço: ${JSON.stringify(v)}`); return v.preco.pc; };
function de(arr, por, filtro = {}) {
  const achados = arr.filter((v) => v.por === por && Object.entries(filtro).every(([k, x]) => v[k] === x));
  if (achados.length !== 1) throw new Error(`esperava um valor por ${por} ${JSON.stringify(filtro)}, achei ${achados.length}`);
  return pcDe(achados[0]);
}
// o `por` do dado é chave sem acento; na tabela ele sai escrito como palavra
const POR_ROTULO = { pagina: 'página', cerimonia: 'cerimônia', apresentacao: 'apresentação', 'tonelada-km': 'tonelada por km' };
const rotuloPor = (v) => `${POR_ROTULO[v.por] || v.por}${v.regime === 'avulso' ? ' (avulso)' : ''}${v.nota ? ` (${v.nota})` : ''}`;

const blocos = {};

// ----------------------------------------------------------------- renda
blocos.renda = envolve(tabela(
  ['Recursos', 'Faixa', 'Renda/Sem', 'Renda/Mês', 'Livre/Sem', 'Livre/Mês', 'Livre/Ano', 'Custo/Sem', 'Nível de vida'],
  ['c', 'l', 'c', 'c', 'c', 'c', 'c', 'c', 'l'],
  RENDA.faixas.map((f) => [bolas(f.recursos), f.faixa, fmt(de(f.renda, 'semana')), fmt(de(f.renda, 'mes')), fmt(de(f.livre, 'semana')), fmt(de(f.livre, 'mes')), fmt(de(f.livre, 'ano')), fmt(de(f.custo, 'semana')), f.nivel_de_vida]),
));

// ------------------------------------------------------------ custo de vida
blocos['custo-de-vida'] = envolve(tabela(
  ['Nível de vida', 'Por semana', 'O que compra', 'Na estalagem (semana)'],
  ['l', 'c', 'l', 'c'],
  VIDA.niveis_pessoa.map((n) => [n.nivel, fmt(pcDe(n.custo)), n.composicao, n.estalagem == null ? 'não se hospeda' : fmt(pcDe(n.estalagem))]),
));
const custoDaFaixa = Object.fromEntries(RENDA.faixas.map((f) => [f.faixa, de(f.custo, 'semana')]));
blocos['pacote-familia'] = envolve(tabela(
  ['Faixa', 'Custo/Sem', 'Pacote básico', 'Estilo de vida', 'O que o pacote cobre'],
  ['l', 'c', 'c', 'c', 'l'],
  Object.entries(VIDA.pacotes_familia).map(([faixa, p]) => [faixa, fmt(custoDaFaixa[faixa]), fmt(Math.round(pcDe(p.pacote))), fmt(Math.round(pcDe(p.estilo_de_vida))),
    p.itens.map((i) => `${i.item} (${fmt(Math.round(pcDe(i)))})`).join('; ')]),
));

// --------------------------------------------------------------- serviços
blocos.tarifas = envolve(tabela(
  ['Perfil', 'Soma', 'Renda/Sem', 'Diária (contrato)', 'Diária avulsa', 'Hora, serviço leve', 'Hora, artesão', 'Hora, braçal'],
  ['l', 'c', 'c', 'c', 'c', 'c', 'c', 'c'],
  SERV.tarifas_por_perfil.map((t) => [t.perfil, t.soma, fmt(de(t.tarifas, 'semana')), fmt(de(t.tarifas, 'dia', { regime: 'contrato' })), fmt(de(t.tarifas, 'dia', { regime: 'avulso' })),
    fmt(de(t.tarifas, 'hora', { oficio: 'leve' })), fmt(de(t.tarifas, 'hora', { oficio: 'artesao' })), fmt(de(t.tarifas, 'hora', { oficio: 'bracal' }))]),
));
const grupos = [...new Set(SERV.servicos.map((s) => s.grupo))];
blocos.servicos = grupos.map((g) => `<p class="cat-cap">${g}</p>\n\n` + envolve(tabela(
  ['Serviço', 'Unidade', 'Preço'], ['l', 'l', 'c'],
  SERV.servicos.filter((s) => s.grupo === g).map((s) => {
    if (!s.preco && !s.ver) throw new Error(`serviço ${s.id} sem preço e sem ver`);
    return [s.nome, rotuloPor(s), s.preco ? fmt(s.preco.pc) : `ver ${s.ver}`];
  }),
))).join('\n\n');
blocos.aulas = envolve(tabela(
  ['O que se aprende', 'Nível novo', 'XP', 'Jornadas de aula', 'Professor (soma)', 'Preço'],
  ['l', 'c', 'c', 'c', 'c', 'c'],
  SERV.aulas.map((a) => [a.tipo, a.novo, a.xp, num(a.jornadas), a.prof_soma, fmt(pcDe(a))]),
));

// ----------------------------------------------------------- servos e escravos
blocos.criados = envolve(tabela(
  ['Criado', 'Salário/Sem', 'Custo total/Sem'], ['l', 'c', 'c'],
  SERV.criados.map((c) => [c.nome, fmt(pcDe(c.salario)), fmt(pcDe(c.custo_total))]),
));
blocos.escravos = envolve(tabela(
  ['Escravo', 'Preço'], ['l', 'c'],
  [...SERV.escravos.map((e) => [e.nome, fmt(pcDe(e))]), [`Sustento (por ${SERV.escravo_sustento.por})`, fmt(pcDe(SERV.escravo_sustento))]],
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
))).join('\n\n') + `\n\n<p class="muted">Manter um cavalo custa <strong>${fmt(pcDe(VIDA.manutencao_cavalo))}</strong> por ${VIDA.manutencao_cavalo.por} (ração, estábulo, ferragem); um cavalo de guerra, <strong>${fmt(pcDe(VIDA.manutencao_cavalo_guerra))}</strong>.</p>`;

// ------------------------------------------------------------------ viagens
blocos.viagens = envolve(tabela(
  ['Como se viaja', 'km por dia'], ['l', 'c'],
  VIAG.velocidades_km_dia.map((v) => [v.modo, v.km_dia]),
)) + '\n\n' + envolve(tabela(
  ['Passagem, aluguel e frete', 'Preço', 'Por'], ['l', 'c', 'l'],
  VIAG.precos.map((p) => [p.nome, fmt(p.preco.pc), rotuloPor(p)]),
));

// ------------------------------------------------------------------ pacotes
const porId = Object.fromEntries(MERC.map((m) => [m.id, m]));
blocos.pacotes = Object.entries(PAC).map(([nome, p]) => {
  const itens = p.itens.map(([id, q]) => { const m = porId[id]; if (!m) throw new Error(`pacote ${nome}: item ${id} não existe em mercadorias.json`); return q > 1 ? `${m.nome} ×${q}` : m.nome; });
  return `- **${nome} (${fmtMisto(p.total.pc)})**: ${itens.join(', ')}.`;
}).join('\n');

// ------------------------------------------- ganhar a vida com o ofício (rodada 113)
// Vai para o capítulo de Ofícios, e não para o de custo: é a regra da decisão B2, com os números de
// renda.json. `valor_por_ponto` guarda o valor da faixa por Dificuldade (dif4, dif7, dif11); o
// exemplo é a curva por soma nos três perfis da tabela de fabricação (oficial 6, perito 9, mestre 12).
const FAIXA_VALOR = { dif4: ['Serviço simples', 4], dif7: ['Ofício', 7], dif11: ['Arte rara', 11] };
for (const k of Object.keys(RENDA.valor_por_ponto)) if (!FAIXA_VALOR[k]) throw new Error(`faixa sem rótulo em gen-cap-economia.mjs: ${k}`);
const emPc = (pc) => `${milhar(Math.round(pc))} pc`;
const PERFIL = { 6: 'Oficial', 9: 'Perito', 12: 'Mestre' };
const curva = Object.fromEntries(RENDA.curva_por_soma.map((c) => [c.soma, c]));
const TETO = { aldeia: 'Aldeia', vila: 'Vila', cidade: 'Cidade', capital: 'Capital' };
for (const k of Object.keys(RENDA.tetos_demanda)) if (!TETO[k]) throw new Error(`teto sem rótulo em gen-cap-economia.mjs: ${k}`);
const blocosOficio = {
  'ganhar-a-vida': envolve(tabela(
    ['Faixa', 'Dificuldade', 'Valor por ponto de média acima dela, por semana'], ['l', 'c', 'c'],
    Object.entries(RENDA.valor_por_ponto).map(([k, v]) => [FAIXA_VALOR[k][0], FAIXA_VALOR[k][1], emPc(pcDe(v))]),
  )) + '\n\n' + envolve(tabela(
    ['Quem', 'Soma', 'Média', 'Melhor faixa (Dificuldade)', 'Ganho por semana'], ['l', 'c', 'c', 'c', 'c'],
    Object.entries(PERFIL).map(([s, nome]) => { const c = curva[s]; if (!c) throw new Error(`curva_por_soma sem a soma ${s}`); return [nome, s, num(c.media), c.faixa_dificuldade, emPc(pcDe(c.renda))]; }),
  )) + '\n\n' + envolve(tabela(
    ['Lugar', 'Teto do ganho, por semana'], ['l', 'c'],
    Object.entries(RENDA.tetos_demanda).map(([k, v]) => {
      if (!v.preco) {
        if (k !== 'capital') throw new Error(`teto sem preço fora da capital em gen-cap-economia.mjs: ${k}`);
        return [TETO[k], 'sem teto'];
      }
      return [TETO[k], emPc(v.preco.pc)];
    }),
  )),
};
const CAP_OFICIO = path.join(raiz, 'src/content/chapters/acoes-oficio-e-mundo.md');

// ------------------------------------------------------------------ escrever
const ALVOS = [[CAP, blocos], [CAP_OFICIO, blocosOficio]];
const montar = (arq, bl) => {
  let md = fs.readFileSync(arq, 'utf8');
  for (const [b, corpo] of Object.entries(bl)) {
    const marca = `economia-${b}`;
    const re = new RegExp(`(<!-- gen:${marca} -->)[\\s\\S]*?(<!-- /gen:${marca} -->)`);
    if (!re.test(md)) throw new Error(`marcador gen:${marca} não encontrado em ${arq}`);
    md = md.replace(re, () => `<!-- gen:${marca} -->\n\n${corpo}\n\n<!-- /gen:${marca} -->`);
  }
  return md;
};
const resumo = `${Object.keys(blocos).length + Object.keys(blocosOficio).length} blocos em 2 capítulos: ${RENDA.faixas.length} faixas de renda, ${MERC.length} mercadorias, ${MONT.length} montarias e veículos, ${SERV.servicos.length} serviços, ${Object.keys(PAC).length} pacotes, a curva de ganhar a vida`;

if (process.argv.includes('--check')) {
  const fora = ALVOS.filter(([arq, bl]) => fs.readFileSync(arq, 'utf8') !== montar(arq, bl)).map(([arq]) => path.relative(raiz, arq));
  if (fora.length) {
    console.error(`✘ ${fora.join(', ')} fora de sincronia com a economia (marcadores gen:economia-*).\n`
      + '  Rode: node scripts/gen-cap-economia.mjs');
    process.exit(1);
  }
  console.log(`✓ tabelas da economia em dia com a fonte (${resumo})`);
  process.exit(0);
}
for (const [arq, bl] of ALVOS) fs.writeFileSync(arq, montar(arq, bl));
console.log(`economia regerada: ${resumo}`);
