// Junta o stat block (src/data/inimigos.json, GERADO por gen-bestiario.mjs) com o
// resto da ficha de cada criatura (src/data/bestiario/<id>.json) num único
// src/data/monsters.json, e recorta dele o monsters-mesa.json.
//
// Desde o B14 (fase 1, 26/09/2026) o card não vem mais de satélite por id
// (habilidades, dimensões, lore, imagens, ecologia, categoria-extra): vem da
// ficha, que já traz a categoria, a descrição, a Aparência e as Virtudes
// ESCRITAS, sem conta pelo desafio. As fraquezas e o deslocamento também vêm da
// ficha; os satélites que os semeiam (gen-elementos, gen-deslocamento) continuam
// e o validate confere que a ficha e a semente concordam.
// Rodar: node scripts/gen-monsters.mjs   (rode gen-bestiario.mjs antes se mexeu nas fichas)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { elementosDoMaterial } from './lib-materiais.mjs';
import { achataCatalogo } from './lib-equip.mjs';
import { lerCriaturas, passoDaPeca, tres } from './lib-bestiario.mjs';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const data = join(dir, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(data, f), 'utf8'));

const inim = read('inimigos.json');
const FICHA = Object.fromEntries(lerCriaturas().map((f) => [f.id, f]));

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
  // exceções por criatura, quando o nome e a velocidade enganarem; vazio por ora
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

function build(c) {
  const f = FICHA[c.id];
  if (!f) throw new Error(`${c.id}: está no inimigos.json e não tem ficha (rode gen-bestiario.mjs)`);
  // Fraqueza e resistência, na ordem: o que a ficha declara vence o `material` dela.
  const doMat = elementosDoMaterial(f.material);
  const elem = {
    fraquezas: f.fraquezas ?? doMat?.fraquezas ?? [],
    resistencias: f.resistencias ?? doMat?.resistencias ?? [],
  };
  const e = f.ecologia || {};
  return {
    id: c.id,
    nome: c.nome,
    nomeIngles: f.nomeIngles || null,
    categoria: f.categoria || c.categoria || null,
    tipo: c.tipo,
    conceito: c.conceito,
    descricao: f.descricao || '',
    tags: c.tags || [],
    ameaca: c.ameaca,
    centelha: c.centelha,
    pendente: !!c.pendente,
    porte: f.porte || null,
    dimensoes: { medida: f.dimensoes?.medida || null, peso: f.dimensoes?.peso || null },
    ecologia: { tipo: e.tipo || null, terreno: e.terreno || [], clima: e.clima || [] },
    imagem: f.imagem || null,
    semImagem: !f.imagem,
    atributos: c.atributos,
    // AS PERICIAS, desde 04/09/2026. Quatro vem da conta invertida dos derivados
    // e a Furtividade vem da tabela por porte e categoria (lib-bestiario.mjs).
    // Elas nao entram em conta nenhuma daqui: o motor continua lendo `defesa`,
    // `defesaMental` e `iniciativa`. Existem para as catorze regras de oposicao
    // que pedem a PERICIA pelo nome, e sao OMITIDAS quando a conta nao fecha.
    ...(c.pericias && Object.keys(c.pericias).length ? { pericias: c.pericias } : {}),
    vontade: c.vontade ?? 5,
    aparencia: f.aparencia,
    virtudes: f.virtues,
    combate: {
      pv: c.pv,
      defesa: c.defesa,
      defesaSocial: c.defesaSocial,
      defesaMental: c.defesaMental,
      absorcao: { impacto: c.soak.impacto, corte: c.soak.corte, perfuracao: c.soak.perfuracao },
      resistenciaPerfuracao: c.resistPerf || 0,
      // Fraqueza e resistência a elemento, tipo de dano ou natureza. A maioria das
      // criaturas não tem nenhuma, então os campos só aparecem em quem tem.
      ...(elem.fraquezas.length ? { fraquezas: elem.fraquezas } : {}),
      ...(elem.resistencias.length ? { resistencias: elem.resistencias } : {}),
      iniciativa: c.iniciativa,
      // Quantos metros a criatura cobre em um Tick, nas três marchas, a partir do
      // passo da `locomocao` da ficha. Sem nenhum, cai no passo do soldado
      // (3 · 5 · 7), porque uma peça sem deslocamento não anda no Grid.
      deslocamento: (() => {
        const passo = passoDaPeca(f.locomocao);
        const d = f.deslocamentoDeclarado ?? (passo ? tres(passo) : { batalha: 3, arranque: 5, corrida: 7 });
        return { batalha: d.batalha, arranque: d.arranque, corrida: d.corrida };
      })(),
      ataques: (c.ataques || []).map((a) => ({ nome: a.nome, pool: a.pool, dano: a.dano, perfArma: a.perfArma ?? null, speed: a.ticks, classe: classeDoAtaque(c.id, a.nome, a.ticks), ...(a.notas ? { notas: a.notas } : {}) })),
    },
    habilidades: (f.habilidades || []).map((x) => ({ nome: x.nome, descricao: x.descricao })),
    poderes: (c.poderes || []).map((p) => ({ efeito: p.efeito, tipo: p.tipo, alvo: p.alvo, ...(p.caminho ? { caminho: p.caminho } : {}), ...(p.arte ? { arte: p.arte } : {}) })),
    tecnicas: c.tecnicas || [],
    artes: (c.artes || []).map((a) => ({ id: a.id && a.id.id ? a.id.id : a.id, nivel: a.nivel })),
    notas: c.notas || '',
    lore: (f.lore || []).map((s) => ({ titulo: s.titulo, texto: s.texto })),
  };
}

const monsters = inim.map(build).sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

// checagem de integridade: todas as fontes presentes por criatura
const problemas = [];
for (const m of monsters) {
  if (!m.atributos) problemas.push(`${m.id}: sem atributos`);
  if (m.combate.pv == null) problemas.push(`${m.id}: sem combate.pv`);
  if (!m.habilidades.length) problemas.push(`${m.id}: sem habilidades`);
  if (!m.lore.length) problemas.push(`${m.id}: sem lore`);
  if (!m.dimensoes.medida) problemas.push(`${m.id}: sem dimensoes`);
  if (!m.ecologia.tipo) problemas.push(`${m.id}: sem ecologia.tipo`);
  // imagem opcional: criaturas sem arte ganham semImagem:true e o badge "Sem imagem"
}
if (problemas.length) {
  console.error('FALHA na unificação:\n' + problemas.join('\n'));
  process.exit(1);
}

const out = join(data, 'monsters.json');
writeFileSync(out, JSON.stringify(monsters, null, 1));
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
  'id', 'nome', 'nomeIngles', 'ameaca', 'centelha', 'categoria', 'porte', 'imagem',
  'semImagem', 'tipo', 'atributos', 'virtudes', 'vontade', 'aparencia',
  // `pericias` ENTROU EM 04/09/2026, e a ausencia dela aqui foi um zero ambiguo
  // de verdade: o bloco `sentidos` do ResumoCombate le `MON[id].pericias`, `MON`
  // vem deste arquivo magro, e a Passiva de TODA criatura da mesa saia `null`
  // sem nada acusar, porque `null` e um valor que o contrato permite. Quem pega
  // isso agora e o `test-sentidos.mjs`.
  'pericias',
  'artes', 'tecnicas', 'combate', 'ecologia', 'dimensoes',
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
  descricao: 'prosa do card, e o card vem por arquivo separado',
  conceito: 'prosa do card',
  habilidades: 'prosa do card, e é o maior pedaço dos 900 KB (27%)',
  lore: 'prosa do card (24%)',
  poderes: 'prosa do card',
  notas: 'caderno do mestre; não desce nem para a aba, quanto mais para o pacote',
  pendente: 'marca de trabalho do bestiário, não é dado de jogo',
  tags: 'usadas no editor e na busca do bestiário, não no tabuleiro',
};

const TEC_POR_ID = Object.fromEntries(read('tecnicas.json').map((t) => [t.id, t]));
const mesa = monsters.map((m) => {
  const o = {};
  for (const k of CAMPOS_MESA) if (m[k] !== undefined) o[k] = m[k];
  if (o.tecnicas) o.tecnicas = resolverTecnicas(o.tecnicas, TEC_POR_ID);
  return o;
});
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
writeFileSync(outMesa, JSON.stringify(mesa, null, 1));
const kb = (n) => (n / 1024).toFixed(0);
console.log(`monsters-mesa.json: ${kb(statSync(outMesa).size)} KB `
  + `(${kb(JSON.stringify(mesa).length)} KB minificado, contra ${kb(JSON.stringify(monsters).length)} KB do inteiro).`);
