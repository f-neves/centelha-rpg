// Gera o card e a vista da mesa a partir das 324 fontes unificadas e dos derivados do motor.
// O deslocamento e os elementos são declarados pela ficha.
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { achataCatalogo } from './lib-equip.mjs';
import { lerCriaturas } from './lib-bestiario.mjs';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const data = join(dir, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(data, f), 'utf8'));

const inim = read('inimigos.json');
const FICHA = Object.fromEntries(lerCriaturas().map((f) => [f.id, f]));
const PRIMARIAS = new Set(read('habilidades.json').map(h => h.id));
// A Técnica ou a Arte do livro que a ficha cita sem texto próprio: o card diz o nome do catálogo e o nível, e não o id
// do arquivo ("visao-verdadeira"; parecer da Veterana, M2).
const NOME_TEC = Object.fromEntries(read('tecnicas.json').map((t) => [t.id, t.nome]));
const NOME_ARTE = Object.fromEntries(read('artes.json').map((a) => [a.id, a.nome]));
const mesmo = (a, b) => String(a).localeCompare(String(b), 'pt', { sensitivity: 'base' }) === 0;
function descricaoDaRef(x) {
  const ref = x.tecnica ? ['Técnica', NOME_TEC[x.tecnica.id], x.tecnica] : x.arte ? ['Arte', NOME_ARTE[x.arte.id], x.arte] : null;
  if (!ref) return x.descricao;
  const [tipo, nome, r] = ref;
  if (!nome) throw Error(`${x.nome}: ${tipo} ${r.id} não está no catálogo`);
  return `${tipo}${mesmo(nome, x.nome) ? '' : ' ' + nome} do livro, nível ${r.nivel}`;
}
function habilidadesPublicas(f, c) {
  const todas = c.pericias || f.motor?.pericias || {};
  return {
    habilidades: { prontidao: 0, furtividade: 0, ...Object.fromEntries(Object.entries(todas).filter(([k]) => PRIMARIAS.has(k))) },
    habilidadesSec: Object.fromEntries(Object.entries(todas).filter(([k]) => !PRIMARIAS.has(k))),
  };
}

// ------------------------------------------------- a classe de tempo do ataque
// A régua P/G/R (e o sistema simultâneo) precisa saber COMO a criatura ataca:
// arma leve, média, pesada, haste, tiro, arremesso ou Arte. O bestiário nunca
// guardou isso; a mesa caía no atalho pela Velocidade (5 leve · 6 média · 7+
// pesada), que erra justamente onde importa: o arco não é "média", é tiro, e o
// forcado alcança dois hexágonos. A estimativa mora AQUI, no gerador (lição do
// B10: correção por cima de arquivo gerado morre no regen), em três camadas,
// cada uma vencendo a de cima:
//   1. o nome bate com uma arma do catálogo → a classe dela;
//   2. palavras que decidem sozinhas (arco/besta/funda → tiro; dardo/azagaia/
//      arremesso → arremesso; forcado/tridente/lança/pique → haste; um "(Arte
//      N)" no nome → arte, porque o gesto é conjuração);
//   3. o resto (garras, presas, pancada, pseudópode, "Arma"…) → pela
//      Velocidade, que é o atalho de sempre, agora explícito no dado.
const ARMAS_CAT = achataCatalogo(read('armas.json'));
const CLASSE_OVERRIDE = {
  // exceções por criatura, quando o nome e a velocidade enganarem.
  // Os dois golems atacam com "Punhos" a Velocidade 6. Até a rodada 13 nenhum nome de arma
  // batia, e a Velocidade os punha em "media". Com a arma Punhos (leve) no catálogo (D-065),
  // o nome os jogaria em "leve", e a mesa mudaria. O Grid está congelado (D-054), então eles
  // ficam em "media" até a passada do Grid (N-grid-pendencias.md, N20).
  'golem-de-ferro': 'media',
  'golem-de-pedra': 'media',
};
function classeDoAtaque(id, nome, ticks) {
  if (CLASSE_OVERRIDE[id]) return CLASSE_OVERRIDE[id];
  const n = String(nome || '').toLowerCase();
  const w = ARMAS_CAT.find((x) => n.startsWith(x.nome.toLowerCase()));
  if (w) return w.classe;
  if (/\([a-zà-ú]+ \d\)/.test(n)) return 'arte';
  if (/\b(arco|besta|funda)\b/.test(n)) return 'distancia';
  if (/(dardo|azagaia|arremess|bumerangue|pilum)/.test(n)) return 'arremesso';
  if (/(forcado|tridente|lança|pique|alabarda|chuço)/.test(n)) return 'haste';
  const v = ticks ?? 5;
  return v <= 5 ? 'leve' : v === 6 ? 'media' : 'pesada';
}

const CATEGORIA_NOME = { animal:'Animal', aberracao:'Aberração', 'besta-magica':'Besta mágica', celestial:'Celestial', humanoide:'Humanoide', 'humanoide-monstruoso':'Humanoide monstruoso', 'morto-vivo':'Morto-vivo', corruptor:'Corruptor', planta:'Planta', construto:'Construto', gigante:'Gigante', limo:'Limo', elemental:'Elemental', dragao:'Dragão', fada:'Fada', outsider:'Extraplanar' };
const idCategoria = v => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,'-');
function build(c, fonte) {
  const f = fonte || FICHA[c.id];
  const categoria = idCategoria(f?.categoria || c.categoria);
  const categoriaNome = CATEGORIA_NOME[categoria] || categoria;
  const tags = [categoria, ...(c.centelha > 0 ? ['centelha'] : []), ...(c.artes?.some(a=>a.nivel > 0) ? ['mágico','arcano'] : [])];
  if (!f) throw new Error(`${c.id}: está no inimigos.json e não tem ficha (rode gen-bestiario.mjs)`);
  // Fraqueza, resistência e imunidade saem da fonte unificada.
  const elem = {
    fraquezas: f.fraquezas ?? [],
    resistencias: f.resistencias ?? [],
    // A fonte marca cada elemento e suas formas.
    imunidades: f.imunidades ?? [],
  };
  const e = f.ecologia || {};
  return {
    ...(f.motor?.edicao ? {edicao:f.motor.edicao} : {}),
    id: c.id,
    nome: c.nome,
    nomeIngles: f.nomeIngles || null,
    categoria, categoriaNome,
    tipo: c.tipo,
    conceito: [categoriaNome, f.porte].filter(Boolean).join(' '),
    descricao: f.descricao || '',
    tags,
    ameaca: c.ameaca,
    centelha: c.centelha,
    tamanho: f.porte || null,
    corpo: { ...f.motor?.corpo, medida: f.dimensoes?.medida || null, peso: f.dimensoes?.peso || null },
    ecologia: { tipo: e.tipo || null, terreno: e.terreno || [], clima: e.clima || [] },
    imagens: [f.imagem, f.imagem2].filter(Boolean),
    semImagem: !f.imagem,
    atributos: c.atributos,
    // Habilidades de oposição publicadas pela fonte; o motor já calculou as Defesas.
    ...habilidadesPublicas(f, c),
    vontade: c.vontade ?? 5,
    aparencia: f.aparencia,
    virtudes: f.virtues,
    combate: {
      pv: c.pv, energia: f.motor?.energia ?? null,
      defesa: c.defesa,
      defesaSocial: c.defesaSocial,
      defesaMental: c.defesaMental,
      absorcao: { impacto: c.soak.impacto, corte: c.soak.corte, perfuracao: c.soak.perfuracao },
      resistenciaPerfuracao: c.resistPerf || 0, ...(c.vestida ? { vestida: c.vestida } : {}), // D-206: com o equipamento; a mesa escolhe (defesa-vestida.ts)
      // Fraqueza e resistência a elemento, tipo de dano ou natureza. A maioria das
      // criaturas não tem nenhuma, então os campos só aparecem em quem tem.
      ...(elem.fraquezas.length ? { fraquezas: elem.fraquezas } : {}),
      ...(elem.resistencias.length ? { resistencias: elem.resistencias } : {}),
      ...(elem.imunidades.length ? { imunidades: elem.imunidades } : {}),
      iniciativa: c.iniciativa,
      // As três velocidades vêm do modo de deslocamento declarado na fonte.
      deslocamento: (()=>{const d=f.deslocamentoDeclarado;if(!d)throw Error(f.id+': deslocamento ausente');return {batalha:d.batalha,arranque:d.arranque,corrida:d.corrida};})(),
      ataques: (c.ataques || []).map((a) => ({ nome: a.nome, pool: a.pool, dano: a.dano, perfArma: a.perfArma ?? null, speed: a.ticks, classe: a.classe ?? classeDoAtaque(c.id, a.nome, a.ticks), ...(a.notas ? { notas: a.notas } : {}) })),
    },
    habilidadesEspeciais: (f.habilidades || []).map((x) => ({ nome: x.nome, descricao: x.descricao || descricaoDaRef(x), ...(x.classe ? {classe:x.classe} : {}), ...(x.base ? {base:x.base} : {}), ...(x.regra ? {regra:x.regra} : {}) })),
    ...(f.motor?.enxame ? {enxame:f.motor.enxame} : {}),
    comoLuta: f.motor?.comoLuta || [], sentidos: f.motor?.sentidos || [], segundoTamanho: f.motor?.segundoTamanho || null,
    ...(f.motor?.formaPrincipal ? {formaPrincipal:f.motor.formaPrincipal} : {}),
    formas: (f.motor?.formas || []).map(fo=>({id:fo.id,nome:fo.nome,criatura:build(fo.ficha.motor.stat,fo.ficha)})),
    poderes: [],
    // Locomoção CRUA, por modo (B14 fase 4, item 5 do Adendo 3): o `deslocamento`
    // acima já é o passo único (m/Tick) que o Grid usa; isto é o detalhe por modo
    // (terra/voo/natação/escalada/escavação/jato) que o card exibe, e que até
    // a fonte declara em cada modo.
    ...(f.locomocao && Object.keys(f.locomocao).length ? { locomocao: f.locomocao } : {}),
    tecnicas: c.tecnicas || [],
    artes: (c.artes || []).map((a) => ({ id: a.id && a.id.id ? a.id.id : a.id, nivel: a.nivel })), ...((f.motor?.mana ?? f.mana) != null ? { mana: f.motor?.mana ?? f.mana } : {}), // a Mana da ficha (D-196)
    lore: (f.lore || []).map((s) => ({ titulo: s.titulo, texto: s.texto })),
  };
}

const monsters = inim.map(c=>build(c)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

// checagem de integridade: todas as fontes presentes por criatura
const problemas = Object.keys(CLASSE_OVERRIDE).filter((id) => !inim.some((c) => c.id === id)).map((id) => `CLASSE_OVERRIDE para id inexistente: ${id}`); // a guarda de chave órfã dos outros satélites (D-179): sem ela, a exceção de um id trocado sumiria calada
for (const m of monsters) {
  if (!m.atributos) problemas.push(`${m.id}: sem atributos`);
  if (m.combate.pv == null) problemas.push(`${m.id}: sem combate.pv`);
      if (!m.corpo.medida) problemas.push(`${m.id}: sem dimensoes`);
  if (!m.ecologia.tipo) problemas.push(`${m.id}: sem ecologia.tipo`);
  // imagem opcional: criaturas sem arte ganham semImagem:true e o badge "Sem imagem"
}
if (problemas.length) {
  console.error('FALHA na unificação:\n' + problemas.join('\n'));
  process.exit(1);
}

// --check (rodada de pendências, Bloco H, 03/10/2026): os dois JSONs saem daqui e ficam
// commitados, e o `inimigos.json` novo com o `monsters.json` velho passava no gancho calado
// (achado da correção da Reforma, item 1). Com `--check` nada é escrito: o gerado é comparado
// com o commitado, e a divergência derruba o `validate`. Mesmo padrão do `gen-bestiario.mjs`.
const CHECK = process.argv.includes('--check');
const divergem = [];
function emitir(arquivo, texto) {
  if (!CHECK) { writeFileSync(arquivo, texto); return; }
  const atual = existsSync(arquivo) ? readFileSync(arquivo, 'utf8') : '';
  if (atual !== texto) divergem.push(arquivo);
}
const out = join(data, 'monsters.json');
emitir(out, JSON.stringify(monsters, null, 1));
console.log(`monsters.json: ${monsters.length} criaturas, ${(statSync(out).size / 1024).toFixed(0)} KB.`);

// ------------------------------------------------- a versão que a mesa carrega
/*
 * `monsters.json` inteiro pesa 709 KB minificados e ia empacotado nas abas da
 * mesa (Grid, Combate e Criaturas), que juntas passavam de 1,4 MB de JavaScript.
 * Mais da metade daquele peso é PROSA: habilidades (27%), lore (24%), poderes,
 * descrição, notas e conceito. Nada disso entra em conta nenhuma do tabuleiro:
 * é texto do card, que o mestre abre para UMA criatura de cada vez.
 *
 * Então a mesa passa a carregar só o bloco de jogo, e o card completo é buscado
 * por criatura em /dados/criatura/<id>.json quando alguém o abre.
 *
 * A lista de campos é curta de propósito. Um campo novo que a mesa precise tem
 * de ser acrescentado AQUI, e o que garante que ninguém esqueça é a TRAVA DAS
 * DUAS LISTAS, logo abaixo: uma chave que não esteja em `CAMPOS_MESA` nem em
 * `FORA_DA_MESA` para o gerador.
 *
 * Onde ficava escrito que esquecer "aparece na hora, o valor chega `undefined`
 * na tela": era falso, e falhou em 04/09/2026 com `pericias`. Nada chega
 * `undefined` na tela porque o caminho o converte antes (`?? null`, `|| 0`,
 * `?.`), e `null` é um valor que o contrato permite. A garantia agora é a trava,
 * e ela é código que roda.
 */
/**
 * AS TÉCNICAS DA CRIATURA, RESOLVIDAS AQUI e não no navegador.
 *
 * O card do bestiário mostra as Técnicas de uma criatura como links para
 * `caminhos/<caminho>#<id>`, e para montar esse link ele precisa de duas coisas
 * por Técnica: o nome e o Caminho. Para tê-las, o `mesa-bestiario.ts` importava
 * o `tecnicas.json` inteiro: **179 KB de JSON, 26,3 KB gzipados**, embarcados em
 * toda aba da mesa, o Grid inclusive.
 *
 * O tamanho do que se usava daquilo: **24 criaturas têm Técnica, 30 Técnicas
 * distintas ao todo, e o par (nome, caminho) das 30 dá 630 bytes gzipados.**
 * Vinte e seis mil bytes para responder seiscentos.
 *
 * Resolvendo aqui, o navegador não carrega catálogo nenhum: o par já vem dentro
 * da criatura. A cópia não desatualiza porque este script roda no build, junto
 * com o resto.
 */
const resolverTecnicas = (ids, catalogo) => (ids || []).map((t) => {
  const id = typeof t === 'string' ? t : t?.id;
  const tec = catalogo[id];
  return { id, nome: tec?.nome || id, caminho: tec?.caminho || '' };
});

const CAMPOS_MESA = [
  'id', 'nome', 'nomeIngles', 'ameaca', 'centelha', 'categoria', 'categoriaNome', 'tamanho', 'imagens',
  'semImagem', 'mana', 'tipo', 'atributos', 'virtudes', 'vontade', 'aparencia',
  // `pericias` ENTROU EM 04/09/2026, e a ausencia dela aqui foi um zero ambiguo
  // de verdade: o bloco `sentidos` do ResumoCombate le `MON[id].pericias`, `MON`
  // vem deste arquivo magro, e a Passiva de TODA criatura da mesa saia `null`
  // sem nada acusar, porque `null` e um valor que o contrato permite. Quem pega
  // isso agora e o `test-sentidos.mjs`.
  'habilidades', 'habilidadesSec',
  'artes', 'tecnicas', 'combate', 'ecologia', 'corpo', 'formas', 'formaPrincipal', 'segundoTamanho', 'enxame',
];
/**
 * O QUE FICA DE FORA DA MESA, DECLARADO, e esta lista é o conserto da CLASSE e
 * não do caso.
 *
 * `CAMPOS_MESA` é uma lista de chaves, e lista de chaves descarta em silêncio o
 * que ninguém lembrou de acrescentar. Foi assim que `pericias` sumiu entre o
 * bestiário e o navegador em 04/09/2026: a tabela estava escrita, a fórmula
 * estava escrita, o bestiário cheio tinha o dado, e o recorte não levava.
 * **Nada acusou, porque uma chave que não chega não deixa rastro.**
 *
 * Com as duas listas, toda chave nova tem de ser DECIDIDA: ou entra na mesa, ou
 * entra aqui com o motivo. Esquecer as duas quebra o gerador em vez de sumir com
 * o dado, que é a direção certa do erro.
 */
const FORA_DA_MESA = {
  edicao: 'fonte do editor, sem revisão privada',
  descricao: 'prosa do card, e o card vem por arquivo separado',
  conceito: 'prosa do card',
  habilidadesEspeciais: 'prosa do card, e é o maior pedaço dos 900 KB (27%)',
  lore: 'prosa do card (24%)',
  poderes: 'prosa do card',
  comoLuta: 'descrição de combate', sentidos: 'descrição dos sentidos',
  tags: 'usadas no editor e na busca do bestiário, não no tabuleiro',
  // O Grid anda pelo passo único de `combate.deslocamento` (já derivado, já em
  // CAMPOS_MESA); isto é só o detalhe por modo que o card mostra (B14 fase 4,
  // Adendo 3, item 5).
  locomocao: 'exibição do card; o Grid anda por combate.deslocamento, já derivado',
};

const TEC_POR_ID = Object.fromEntries(read('tecnicas.json').map((t) => [t.id, t]));
function recorteMesa(m) {
  const o = {};
  for (const k of CAMPOS_MESA) if (m[k] !== undefined) o[k] = m[k];
  if (o.tecnicas) o.tecnicas = resolverTecnicas(o.tecnicas, TEC_POR_ID);
  if (o.formas) o.formas=o.formas.map(f=>({...f,criatura:recorteMesa(f.criatura)}));
  return o;
}
const mesa = monsters.map(recorteMesa);
// A TRAVA: toda chave produzida tem de estar numa das duas listas.
{
  const conhecidas = new Set([...CAMPOS_MESA, ...Object.keys(FORA_DA_MESA)]);
  const orfas = new Set();
  for (const m of monsters) for (const k of Object.keys(m)) if (!conhecidas.has(k)) orfas.add(k);
  if (orfas.size) {
    console.error(`✘ chave(s) sem decisão entre o bestiário e a mesa: ${[...orfas].join(', ')}`);
    console.error('  Toda chave nova entra em CAMPOS_MESA (vai para o navegador) ou em');
    console.error('  FORA_DA_MESA (com o motivo escrito). Sem decidir, ela sumia calada.');
    process.exit(1);
  }
}

const outMesa = join(data, 'monsters-mesa.json');
emitir(outMesa, JSON.stringify(mesa, null, 1));
const kb = (n) => (n / 1024).toFixed(0);
console.log(`monsters-mesa.json: ${kb(statSync(outMesa).size)} KB `
  + `(${kb(JSON.stringify(mesa).length)} KB minificado, contra ${kb(JSON.stringify(monsters).length)} KB do inteiro).`);

if (CHECK) {
  if (divergem.length) {
    console.error(`✘ gen-monsters --check: fora de sincronia com o inimigos.json: ${divergem.map((f) => f.split(/[\\/]/).pop()).join(', ')}.`);
    console.error('  Rode `node scripts/gen-monsters.mjs` e commite junto.');
    process.exit(1);
  }
  console.log('✓ monsters.json e monsters-mesa.json em dia com o inimigos.json');
}
