// Unifica os 5 arquivos de dados do bestiário num único src/data/monsters.json.
// Fonte: inimigos.json (stat block, GERADO por gen-bestiario.mjs) + os satélites
// habilidades / dimensoes / lore / imagens / ecologia / elementos, todos por id.
// Rodar: node scripts/gen-monsters.mjs   (rode gen-bestiario.mjs antes se mexeu nas builds)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { elementosDoMaterial } from './lib-materiais.mjs';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const data = join(dir, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(data, f), 'utf8'));

const inim = read('inimigos.json');
const HAB = read('habilidades-bestiario.json');
const DIM = read('dimensoes-bestiario.json');
const LORE = read('lore-bestiario.json');
const IMG = read('imagens-bestiario.json');
const ECO = read('ecologia-bestiario.json'); // tipo (PF2e) + terreno + clima, por id
const ELE = read('elementos-bestiario.json'); // fraquezas e resistencias, por id (gen-elementos.mjs)
// As três velocidades em m/Tick, por id (gen-deslocamento.mjs). O `ft` e a
// `origem` que moram no satélite são metadados da SEMEADURA, e ficam de fora do
// monsters.json: a mesa quer saber quantos metros a peça anda, não de que página
// do Bestiary o número saiu.
const DESL = read('deslocamento-bestiario.json');
// Criaturas suas: o arquivo é a fonte ÚNICA delas, então os satélites vêm dentro
// do próprio objeto em vez de morarem nos seis arquivos por id.
const CUSTOM = Object.fromEntries((() => {
  try { return JSON.parse(readFileSync(join(data, 'inimigos-custom.json'), 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return []; throw e; }
})().filter((c) => c && c.id).map((c) => [c.id, c]));

// Categoria = tipo de criatura no molde do Bestiary 1 (Pathfinder 1e, pág. 318 "Monsters by Type"),
// derivada do ecologia.tipo + ajustes por criatura. Vai para o badge de Categoria.
const CAT_LABEL = {
  Aberration: 'Aberração', Animal: 'Animal', Beast: 'Besta mágica', Celestial: 'Celestial',
  Construct: 'Construto', Dragon: 'Dragão', Elemental: 'Elemental', Fey: 'Fada', Fiend: 'Corruptor',
  Giant: 'Gigante', Humanoid: 'Humanoide', Ooze: 'Limo', Plant: 'Planta', Undead: 'Morto-vivo',
  Monitor: 'Outsider', Spirit: 'Espírito',
};
const CAT_OVERRIDE = {
  // Humanoide monstruoso (PF1e Monstrous Humanoid)
  'mon-bruxa-verde-hag': 'Humanoide monstruoso', 'mon-gargula': 'Humanoide monstruoso',
  'mon-harpia': 'Humanoide monstruoso', 'mon-lamia': 'Humanoide monstruoso',
  'mon-medusa': 'Humanoide monstruoso', 'mon-minotauro': 'Humanoide monstruoso',
  // Outsider nativo (PF1e Outsider native)
  'mon-couatl': 'Outsider', 'mon-rakshasa': 'Outsider',
  // Oni é do tipo gigante
  'mon-ogro-mago-oni': 'Gigante',
  // ajustes pontuais
  'mon-doppelganger': 'Aberração', 'mon-unicornio': 'Besta mágica',
};
// criaturas importadas do Bestiary 1: categoria calculada do tipo PF (categoria-extra.json)
try { Object.assign(CAT_OVERRIDE, read('categoria-extra.json')); } catch { /* sem extras */ }
const catDe = (id, tipo) => CAT_OVERRIDE[id] || CAT_LABEL[tipo] || tipo || null;

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
const ARMAS_CAT = read('armas.json');
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

// Aparência (traço próprio 1–10 do sistema; para criaturas liberamos extremos <0 ou >10)
// e Virtudes (Compaixão · Convicção · Temperança · Valor), derivadas da NATUREZA (ecologia.tipo
// + categoria). É um ponto de partida por categoria — o Mestre afina caso a caso pela descrição.
// A Aparência é INDEPENDENTE da Compostura: um corruptor pode ter Aparência baixa (feio) e
// Compostura alta (postura que intimida e amedronta).
const AP_BASE = {
  Celestial: 10, Positive: 9, Fey: 8, Dragon: 8, Astral: 6, Monitor: 6, Dream: 6, Spirit: 5,
  Elemental: 5, Beast: 5, Time: 5, Animal: 4, Construct: 4, Ethereal: 4, Humanoid: 4, Petitioner: 4,
  Plant: 3, Shadow: 3, Undead: 2, Fungus: 2, Fiend: 1, Aberration: 1, Ooze: 1, Negative: 1,
};
// exceções notáveis (belezas fora da curva do tipo, e feiuras extremas)
const AP_OVER = {
  'mon-solar': 12, 'mon-planetar': 11, 'mon-deva-astral': 10, 'mon-couatl': 9, 'mon-unicornio': 10,
  'mon-sucubo': 9, 'mon-medusa': 7, 'mon-balor': -2, 'mon-vrock': 0, 'mon-nalfeshnee': -1,
};
function aparenciaDe(id, tipo, ameaca) {
  if (AP_OVER[id] !== undefined) return AP_OVER[id];
  let ap = AP_BASE[tipo] ?? 4;
  if (tipo === 'Fiend') ap = 1 - Math.max(0, ameaca - 4);   // corruptores maiores, mais horrendos (até negativo)
  else if (tipo === 'Celestial') ap += ameaca >= 5 ? 2 : 0; // alto escalão celestial, deslumbrante
  else if (tipo === 'Dragon') ap += ameaca >= 5 ? 1 : 0;    // dragões anciãos, mais imponentes
  return ap;
}
// Virtudes por tipo: [Compaixão, Convicção, Temperança, Valor]. Animais e seres animalescos ficam
// baixos nas virtudes "de ser pensante" (Compaixão/Temperança), coerente com Perspicácia/Int baixas.
const V_BASE = {
  Celestial: [5, 5, 4, 4], Positive: [5, 4, 3, 3], Fey: [3, 3, 2, 3], Dragon: [2, 5, 3, 5],
  Monitor: [2, 4, 3, 4], Humanoid: [2, 3, 2, 3], Giant: [1, 3, 2, 4], Spirit: [1, 3, 2, 3],
  Elemental: [1, 3, 2, 3], Beast: [1, 3, 2, 3], Animal: [1, 2, 2, 2], Construct: [0, 3, 3, 3],
  Fiend: [0, 5, 2, 4], Undead: [0, 4, 2, 3], Aberration: [0, 3, 2, 3], Plant: [0, 2, 1, 2],
  Fungus: [0, 1, 1, 2], Ooze: [0, 1, 1, 2], Negative: [0, 4, 2, 3],
};
function virtudesDe(tipo, categoria, ameaca, en) {
  let [co, cv, te, va] = V_BASE[tipo] || [2, 2, 2, 2];
  const devil = categoria === 'Diabo' || /devil/i.test(en || '');
  const demon = !devil && (categoria === 'Demônio' || tipo === 'Fiend');
  if (devil) { co = 1; cv = 5; te = 5; va = Math.max(va, 3); }   // diabos: lei fria e implacável
  else if (demon) { co = 0; cv = 5; te = 1; va = 5; }            // demônios: fúria caótica
  va = Math.min(6, va + (ameaca >= 5 ? 1 : 0));                  // mais temível → mais Valor
  return { compaixao: co, conviccao: cv, temperanca: te, valor: va };
}

// Descrição-flavor: o gen-bestiario grava uma linha genérica pela categoria CRUA (categoriaDe),
// que às vezes destoa da categoria FINAL (ex.: um Construto que saiu com texto de "aberração
// humanoide"). Aqui, quando a descrição é uma das genéricas conhecidas, trocamos pela linha da
// categoria FINAL. Exceções por criatura (categoria certa, mas a linha genérica não cabe).
const CAT_DESC = {
  'Aberração': 'Coisa de forma errada, de pesadelos e profundezas.', 'Animal': 'Animal selvagem, perigo puro sem malícia.',
  'Besta mágica': 'Fera tocada pela magia, além do reino natural.', 'Celestial': 'Servo do bem, luz encarnada em guerra contra as trevas.',
  'Construto': 'Autômato sem vida, movido por magia alheia.', 'Dragão': 'Predador alado e mágico, orgulho e ganância feitos carne.',
  'Elemental': 'Ser de um único elemento, sem alma mortal.', 'Fada': 'Espírito da natureza, belo e caprichoso.',
  'Corruptor': 'Nativo dos planos infernais, feito de crueldade e corrupção.', 'Gigante': 'Colosso humanoide, força bruta em escala descomunal.',
  'Humanoide': 'Povo civilizado ou selvagem, do tamanho de um homem.', 'Humanoide monstruoso': 'Aberração humanoide de lendas antigas.',
  'Limo': 'Massa informe que digere tudo que toca.', 'Planta': 'Vegetal desperto, lento e implacável.',
  'Morto-vivo': 'Um morto que não descansa, movido por magia ou ódio.', 'Outsider': 'Nativo de outro plano, alheio às leis mortais.',
  'Demônio': 'Horror caótico do Abismo, feito de fúria e corrupção.', 'Diabo': 'Tirano leal do Inferno, calculista e cruel.',
  'Exterior': 'Nativo de outro plano, alheio às leis mortais.', 'Espírito': 'Presença sem corpo, eco de vontade além da morte.',
};
const GEN_DESC = new Set([...Object.values(CAT_DESC), 'Fera tocada pela magia, além do reino natural.']);
const DESC_OVER = {
  'mon-mite': 'Fada mesquinha e degenerada das cavernas, covarde e vingativa.',
  'mon-lemure': 'Alma condenada derretida na forma mais baixa do Inferno, sem mente própria.',
  'mon-goblin': 'Humanoide pequeno e covarde, perigoso mesmo assim em bando.',
  'mon-tiefling': 'Mortal marcado por sangue infernal, vive à margem dos povos.',
};

function build(c) {
  const cu = CUSTOM[c.id];
  // Fraqueza e resistência, na ordem: o que a criatura declara explicitamente
  // vence o `material` dela, que vence o satélite do bestiário.
  const doMat = cu ? elementosDoMaterial(cu.material) : null;
  const elem = {
    fraquezas: cu?.fraquezas ?? doMat?.fraquezas ?? ELE[c.id]?.fraquezas ?? [],
    resistencias: cu?.resistencias ?? doMat?.resistencias ?? ELE[c.id]?.resistencias ?? [],
  };
  // Para a criatura sua, o satélite vem de dentro dela. Assim ela não precisa de
  // uma linha em cada um dos seis arquivos só para passar no portão de integridade.
  const h = cu ? { en: cu.nomeIngles || null, hab: (cu.habilidades || []).map((x) => ({ n: x.nome, d: x.descricao })) } : (HAB[c.id] || {});
  const d = cu ? { porte: cu.porte || 'Médio', medida: cu.dimensoes?.medida || 'sem medida', peso: cu.dimensoes?.peso || 'sem peso' } : (DIM[c.id] || {});
  const l = cu ? { secoes: (cu.lore || []).map((s) => ({ t: s.titulo, d: s.texto })) } : (LORE[c.id] || {});
  const e = cu ? { tipo: cu.ecologia?.tipo || 'Construct', terreno: cu.ecologia?.terreno || [], clima: cu.ecologia?.clima || [] } : (ECO[c.id] || {});
  const categoria = catDe(c.id, e.tipo) || c.categoria || null;
  let descricao = c.descricao || '';
  if (DESC_OVER[c.id]) descricao = DESC_OVER[c.id];
  else if (GEN_DESC.has(descricao.trim()) && CAT_DESC[categoria]) descricao = CAT_DESC[categoria];
  return {
    id: c.id,
    nome: c.nome,
    nomeIngles: h.en || null,
    categoria,
    tipo: c.tipo,
    conceito: c.conceito,
    descricao,
    tags: c.tags || [],
    ameaca: c.ameaca,
    centelha: c.centelha,
    pendente: !!c.pendente,
    porte: d.porte || null,
    dimensoes: { medida: d.medida || null, peso: d.peso || null },
    ecologia: { tipo: e.tipo || null, terreno: e.terreno || [], clima: e.clima || [] },
    imagem: IMG[c.id] || null,
    semImagem: !IMG[c.id],
    atributos: c.atributos,
    // AS PERICIAS, desde 04/09/2026. Quatro vem da conta invertida dos derivados
    // (o gerador do bestiario as consumia e descartava) e a Furtividade vem da
    // tabela por porte e categoria. Elas nao entram em conta nenhuma daqui: o
    // motor continua lendo ,  e . Existem para
    // as catorze regras de oposicao que pedem a PERICIA pelo nome, e sao
    // OMITIDAS quando a conta nao fecha, em vez de zeradas.
    ...(c.pericias && Object.keys(c.pericias).length ? { pericias: c.pericias } : {}),
    vontade: c.vontade ?? 5,
    aparencia: aparenciaDe(c.id, e.tipo, c.ameaca),
    virtudes: virtudesDe(e.tipo, categoria, c.ameaca, h.en),
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
      // Quantos metros a criatura cobre em um Tick, nas três marchas. Vem do
      // satélite; a criatura sua pode declarar as dela dentro do próprio objeto.
      // Sem nenhum dos dois, cai no passo do soldado (3 · 5 · 7), porque uma
      // peça sem deslocamento não anda no Grid, e uma criatura nova não pode
      // travar o tabuleiro só por ainda não ter passado pela semeadura.
      deslocamento: (() => {
        const d = cu?.deslocamento ?? DESL[c.id] ?? { batalha: 3, arranque: 5, corrida: 7 };
        return { batalha: d.batalha, arranque: d.arranque, corrida: d.corrida };
      })(),
      ataques: (c.ataques || []).map((a) => ({ nome: a.nome, pool: a.pool, dano: a.dano, speed: a.ticks, classe: classeDoAtaque(c.id, a.nome, a.ticks), ...(a.notas ? { notas: a.notas } : {}) })),
    },
    habilidades: (h.hab || []).map((x) => ({ nome: x.n, descricao: x.d })),
    poderes: (c.poderes || []).map((p) => ({ efeito: p.efeito, tipo: p.tipo, alvo: p.alvo, ...(p.caminho ? { caminho: p.caminho } : {}), ...(p.arte ? { arte: p.arte } : {}) })),
    tecnicas: c.tecnicas || [],
    artes: (c.artes || []).map((a) => ({ id: a.id && a.id.id ? a.id.id : a.id, nivel: a.nivel })),
    notas: c.notas || '',
    lore: (l.secoes || []).map((s) => ({ titulo: s.t, texto: s.d })),
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
