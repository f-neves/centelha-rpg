#!/usr/bin/env node
/**
 * Projeta as Artes e os Efeitos Especiais no tabuleiro de hexágonos.
 *
 * O bloco `grid` responde cinco perguntas que o livro não precisava responder e
 * o tabuleiro precisa:
 *
 *   1. QUE ESPAÇO ocupa            → forma  (aura, zona, muro, cone, alvo…)
 *   2. ONDE nasce                  → ancora (no conjurador, num ponto, num alvo)
 *   3. QUANDO morde                → gatilho (imediato, ao entrar, por turno…)
 *   4. A ARMADURA para o dano?     → materia (a regra do "deixou matéria no mundo")
 *   5. QUE ESTADO deixa no alvo    → condicao (do catálogo de 52 da mesa)
 *
 * A quarta é a única que não se lê da estrutura: `regras.json → arcano.resistencia
 * .armadura` diz que o que decide não é a aparência do efeito, é se ele deixou
 * matéria no mundo. Fenômeno puro (fogo, raio, o gelo que evapora) só é absorvido
 * pela Centelha; matéria conjurada (a lasca, a lança de gelo) ou pré-existente (o
 * cascalho, o barril arremessado) entra nas trilhas normais. Por isso `materia`
 * mora no EFEITO e `elemento` mora na ARTE: a mesma Aura é de Fogo ou de Gelo
 * conforme a Arte que a conjura, mas ela nunca vira matéria em nenhuma das duas.
 *
 * A quinta é o que faz o Efeito valer fora deste arquivo: gravada como condição
 * de verdade no combatente, a penalidade entra sozinha na Defesa, no acerto e nos
 * Ticks em todas as abas da mesa, porque o rastreador já sabe somar condições.
 *
 * O grosso sai por derivação (o `Alcance` fixo já diz a âncora em 46 dos 139).
 * As tabelas embaixo só corrigem onde o texto contraria a estrutura, e o script
 * quebra se sobrar Efeito sem classificação ou se uma tabela citar um id que não
 * existe: é isso que impede a lista de apodrecer quando um Efeito novo entrar.
 *
 * Uso: node scripts/gen-grid-artes.mjs [--check] [--lista]
 *   --check  não grava; só confere se os JSONs já estão em dia (para o build)
 *   --lista  imprime a classificação inteira, agrupada por forma
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = (f) => join(RAIZ, 'src', 'data', f);
const ler = (f) => JSON.parse(readFileSync(p(f), 'utf8'));

const ARTES = ler('artes.json');
const EFEITOS = ler('efeitos.json');
const CONDICOES = ler('condicoes.json').lista;

// ===================================================================== ARTES
/**
 * O elemento de cada Arte, no vocabulário fechado de `elementos-vocab.json`.
 * É ele que casa com `fraquezas`/`resistencias` da criatura: um elemental de
 * madeira que leva Fogo não absorve nada e a queimadura não fecha sozinha.
 *
 * As Artes universais não têm elemento. Isso não quer dizer que não causem dano
 * (Morte e Forças causam), quer dizer que nenhuma criatura é "fraca a Forças".
 */
const ELEMENTO = {
  fogo: 'fogo', gelo: 'gelo', raio: 'raio', agua: 'agua',
  vento: 'vento', terra: 'terra', luz: 'luz', sombra: 'sombra',
};

/**
 * Quantos d6 vale cada nível do parâmetro Dano.
 * `regras.json → arcano.improviso.graus.notaDano`: Terra dobra o dado.
 */
const DADO_POR_NIVEL = { terra: 2 };

/**
 * Artes sem parâmetro de Dano no improviso, pela mesma nota das regras: Vento e
 * Sombra não empurram dano bruto, empurram o corpo e a treva. Os Efeitos delas
 * que ferem (Braços do Abismo) trazem o próprio Dano, e por isso a trava vale só
 * para o improviso.
 */
const SEM_DANO_BRUTO = ['vento', 'sombra'];

/** A tinta de cada Arte no tabuleiro. Sai da paleta do site, não do arco-íris. */
const COR = {
  fogo: '#d1542a', gelo: '#5aa9c9', raio: '#d8b13a', agua: '#3d7ea6',
  vento: '#9fb3a8', terra: '#8a6a43', luz: '#e0c86a', sombra: '#5b4a72',
  cura: '#6f9f6a', vida: '#7aa05a', morte: '#6b5f6e', fascinacao: '#a6688f',
  adivinhacao: '#7b8fb5', fortuna: '#c19a5b', conjuracao: '#8a7fb0',
  forcas: '#7d7f8c', materia: '#94795d', tempo: '#6d8f9c', espirito: '#8fa3b8',
  protecao: '#7e9ab0', ofuscacao: '#7a7a86', natureza: '#6f9256',
  metamorfose: '#9a7f6b', 'manipulacao-mana': '#8b7fa8',
};

const gridDaArte = (a) => ({
  elemento: ELEMENTO[a.id] || null,
  cor: COR[a.id] || '#8a8a8a',
  dadoPorNivel: DADO_POR_NIVEL[a.id] || 1,
  danoBruto: !SEM_DANO_BRUTO.includes(a.id),
});

// =================================================================== EFEITOS
const FORMAS = ['nenhuma', 'alvo', 'aura', 'zona', 'muro', 'cone', 'linha', 'cadeia', 'token', 'movimento'];

/**
 * Forma, quando a estrutura não basta.
 *
 * Cada id aparece UMA vez em UMA lista, e o script cobra isso. A derivação cobre
 * o resto; estas são as exceções que só o texto do Efeito revela.
 */
const FORMA = {
  // Leque à frente do conjurador. "Espalha estilhaços num leque", "um cone de frio".
  cone: ['lascas', 'sopro-do-norte'],
  // Salta de alvo em alvo. "O raio salta de um alvo ao seguinte."
  cadeia: ['corrente'],
  // Reta que atravessa o que estiver no caminho.
  linha: ['passo-relampago'],
  // Parede: nasce com comprimento, e não com área.
  muro: ['muro', 'escudo-de-forca'],
  // Põe uma peça nova no tabuleiro, que age por conta própria.
  token: ['servo-menor', 'servo-de-ossos', 'invocar', 'legiao', 'hoste', 'chamado'],
  // Tira alguém de um lugar e põe em outro: o efeito É o deslocamento.
  movimento: ['passo-entre-sombras', 'fresta', 'portal', 'convocar', 'chamar-a-mao',
    'empurrao-elemental', 'onda', 'maremoto', 'tromba', 'arremesso', 'engolir', 'onde-e-embaixo'],
  // Área fixa no chão, mesmo sem parâmetro de Área declarado, ou terreno que muda.
  zona: ['brasa-retardada', 'semente-adormecida', 'imagem-viva', 'praga',
    'sarcal', 'barreira', 'criar-substancia', 'erguer-a-montanha',
    'inverno', 'semear-o-ermo'],
  // Gruda no alvo e anda com ele, apesar de parecer terreno.
  alvo: ['fogo-que-nao-apaga', 'podridao', 'arma-conjurada', 'criar-utensilio', 'parar'],
  // Sem representação no tabuleiro: acontece na ficção, na mesa ou na ficha.
  nenhuma: ['momento-certo', 'porta-aberta', 'isso-vai-dar-certo', 'ricochete-do-destino',
    'reverter-o-golpe', 'destino-torto', 'oraculo', 'encruzilhada', 'olho-distante',
    'boa-impressao', 'remendo', 'transmutar', 'transmutar-semelhante', 'chave-mestra',
    'bolso-torto', 'voz-da-mata', 'aplacar', 'vincular-ao-objeto', 'rosto-esquecivel',
    'rosto-emprestado', 'sussurro-distante', 'rastro', 'mao-invisivel', 'olhos-da-mata',
    'eco-do-lugar', 'sentir-o-ermo', 'esquecer', 'reescrever', 'sugestao-plantada',
    'banir', 'esconder-a-carga', 'refazer-o-corpo',
    'lapso', 'instante', 'emprestar-o-tempo', 'dissipar', 'aviso'],
};

/**
 * Cobre a arena inteira, e não uma área medida.
 *
 * São os Efeitos de escala de REGIÃO: o Inverno traz o inverno para a região e
 * o Semear o Ermo transforma um ermo em mata. Qualquer arena cabe dentro disso,
 * e desenhar um quadrado de 8 × 8 no meio do mapa mentiria sobre o alcance.
 */
const ARENA_INTEIRA = ['inverno', 'semear-o-ermo'];

/**
 * Desfaz magia alheia: em vez de escolher um chão ou um corpo, escolhe um EFEITO
 * que já está no tabuleiro. `arcano` manda comparar níveis, e o Dissipar apaga
 * de uma vez o que for de nível igual ou menor ao investido.
 */
const DISSIPA = ['dissipar'];

/**
 * Quando o efeito morde.
 *
 * `ao-entrar` é a marca da zona e da aura: o dano não acontece ao conjurar, e sim
 * quando alguém pisa dentro ou passa por ali, e no máximo UMA vez por turno para
 * a mesma criatura (decisão de mesa: entrar, encostar e atacar não viram três
 * rolagens no mesmo turno).
 * `por-turno` volta sozinho a cada rodada em quem já está preso.
 * `armadilha` dorme até alguém pisar, e gasta-se ao disparar.
 */
const GATILHO = {
  'por-turno': ['fogo-que-nao-apaga', 'esmagar', 'chuva-de-fogo', 'tempestade', 'afogar',
    'mao-firme', 'acelerar-a-cura', 'coracao-verde', 'aurora'],
  armadilha: ['brasa-retardada', 'semente-adormecida', 'cura-guardada', 'salvaguarda'],
  'ao-tocar': ['arma-elemental', 'metal-incandescente', 'arma-conjurada', 'projetil-conjurado'],
  // Acontece e acaba, mesmo tendo Área: a Praga fere "uma vez por dia", não por turno.
  imediato: ['maos-sobre-a-multidao', 'dreno', 'praga'],
  passivo: ['ver-o-fio'],
};

/**
 * Deixou matéria no mundo, então a armadura absorve normalmente.
 *
 * A regra está em `regras.json → arcano.resistencia.armadura`, e a lista sai do
 * texto de cada Efeito: a Lasca diz "é matéria de verdade, então a armadura
 * absorve normalmente"; a Aura de Fogo não deixa nada, e só a Centelha a apara.
 */
const MATERIA = {
  impacto: ['arremesso', 'esmagar', 'maremoto', 'onda', 'terremoto',
    'empurrao-elemental', 'tromba', 'erguer-a-montanha', 'engolir'],
  perfuracao: ['lascas', 'sarcal', 'semente-adormecida'],
  corte: ['arma-conjurada'],
};
/**
 * Ignora a armadura por escrito, mesmo parecendo físico. Braços do Abismo diz
 * "o dano é de Impacto e ignora armadura, porque a treva entra pela roupa"; o
 * Dreno diz "o dano é do tipo que a armadura não para".
 *
 * O Projétil Conjurado é o caso mais teimoso da lista, e o único que precisou
 * de decisão de mesa. Ele PARECE a Lasca: tem ponta, fura, e a Lasca entra na
 * trilha física sem discussão. A diferença é que a Lasca é um estilhaço, e o
 * projétil é o elemento inteiro tomando a forma de um dardo, sem deixar de ser
 * o elemento. A flecha de chama não é uma flecha em chamas, é chama com
 * formato de flecha, e nada do que se veste segura chama. Vale para as sete
 * Artes dele, inclusive as que fazem matéria de verdade (gelo, terra, água):
 * é a forma do Efeito que decide, e não o material da Arte.
 */
const IGNORA_ARMADURA = ['bracos-do-abismo', 'dreno', 'paralisia', 'projetil-conjurado'];

/** Quem pode ser escolhido. Deriva do Alcance fixo; aqui só o que foge. */
const ALVO = {
  si: ['manto-de-treva', 'meio-corpo', 'dobrar-o-corpo', 'fera-de-guerra', 'asas', 'ausencia', 'parar'],
  objeto: ['arma-elemental', 'enferrujar', 'podridao', 'remendo', 'chave-mestra',
    'vincular-ao-objeto', 'esconder-a-carga', 'bolso-torto', 'chamar-a-mao', 'convocar',
    'arma-conjurada', 'projetil-conjurado', 'criar-utensilio'],
};

/**
 * O efeito marca uma PEÇA do alvo, e não o corpo dele.
 *
 * Não é a mesma pergunta de `alvo`. O Metal Incandescente MIRA numa criatura (é
 * um ataque, com jogada de acerto) e o que fica em brasa é a armadura dela;
 * quem escolhe a peça é o mestre, depois de acertar. Já a Arma Elemental toca a
 * peça direto, sem alvo nenhum no meio. Os dois precisam da caixa do item, e só
 * um deles tem `alvo: objeto`.
 */
const PEGA_ITEM = [
  'metal-incandescente', 'arma-elemental', 'enferrujar', 'podridao',
  'esconder-a-carga', 'chave-mestra', 'remendo', 'vincular-ao-objeto',
];

/**
 * O estado que o Efeito deixa no alvo, no vocabulário do rastreador.
 *
 * Escrita como condição de verdade no combatente, ela vale em todas as abas: a
 * Defesa do Ogro congelado já sai errada de propósito na aba Combate, sem
 * ninguém relembrar a mesa. O Efeito guarda até quando vale e a retira sozinho.
 *
 * Nem todo Efeito deixa estado: dano puro não deixa, e revelação também não.
 */
const CONDICAO = {
  'em-chamas': ['fogo-que-nao-apaga', 'chuva-de-fogo', 'brasa-retardada'],
  congelado: ['sopro-do-norte'],
  eletrizado: ['corrente', 'tempestade', 'ceu-aberto'],
  imobilizado: ['prisao', 'engolir', 'paralisia', 'circulo'],
  agarrado: ['bracos-do-abismo', 'coracao-verde'],
  cego: ['aurora', 'dia'],
  ofuscado: ['clarao'],
  escuridao: ['noite', 'devorar-a-luz', 'mordaca'],
  amedrontado: ['pavor', 'mortalha'],
  doente: ['praga'],
  sufocando: ['afogar'],
  retardado: ['passo-lento', 'peso', 'definhar'],
  'terreno-dificil': ['chao-traicoeiro', 'trilha-fechada', 'vendaval', 'inverno'],
  caido: ['terremoto', 'fenda', 'onda', 'maremoto', 'tromba', 'onde-e-embaixo', 'empurrao-elemental'],
  marcado: ['marca-do-fim'],
  amaldicoado: ['azar-marcado'],
  abencoado: ['mare-da-sorte', 'aviso', 'momento-certo'],
  protegido: ['anteparo', 'barreira', 'pele-de-pedra', 'escudo-de-forca', 'salvaguarda',
    'escudo-de-vento', 'campo-de-alivio', 'santuario'],
  voando: ['asas', 'salto-do-vento'],
  escondido: ['manto-de-treva', 'manto-alheio', 'esconder-a-carga', 'ninguem-passou-por-aqui'],
  invisivel: ['ausencia', 'rosto-esquecivel'],
  confuso: ['esquecer', 'imagem-viva'],
  dominado: ['sugestao-plantada', 'reescrever'],
  acelerado: ['lapso', 'instante', 'bolha-temporal'],
  // O Parar resolvido do lado de quem conjura: as ações dele deixam de custar
  // Ticks, em vez de o tabuleiro mexer no relógio de todos os outros.
  'fora-do-tempo': ['parar'],
};

// ------------------------------------------------------------- as derivações
const parDe = (e, nome) => (e.parametros || []).find((x) => x.nome === nome);
const temPar = (e, nome) => !!parDe(e, nome);
const alcanceFixo = (e) => {
  const a = parDe(e, 'Alcance');
  return a && a.tipo === 'fixo' ? String(a.valor) : null;
};

function formaDe(e) {
  for (const [f, ids] of Object.entries(FORMA)) if (ids.includes(e.id)) return f;
  const af = alcanceFixo(e);
  if (af === 'centralizado no conjurador') return 'aura';
  if (temPar(e, 'Comprimento')) return 'muro';
  if (temPar(e, 'Área') || temPar(e, 'Volume')) return 'zona';
  return 'alvo';
}

function ancoraDe(e, forma) {
  if (forma === 'nenhuma') return 'nenhuma';
  if (forma === 'aura' || forma === 'linha') return 'conjurador';
  const af = alcanceFixo(e);
  if (af === 'em você') return 'conjurador';
  if (ALVO.objeto.includes(e.id) || (af && /objeto/.test(af))) return 'objeto';
  if (['zona', 'muro', 'token', 'cone'].includes(forma)) return 'ponto';
  return 'alvo';
}

function gatilhoDe(e, forma) {
  for (const [g, ids] of Object.entries(GATILHO)) if (ids.includes(e.id)) return g;
  if (forma === 'aura' || forma === 'zona') return 'ao-entrar';
  if (forma === 'nenhuma') return 'passivo';
  return temPar(e, 'Dano') ? 'imediato' : 'passivo';
}

function alvoDe(e, forma, ancora) {
  if (ALVO.si.includes(e.id)) return 'si';
  if (ancora === 'objeto') return 'objeto';
  if (forma === 'nenhuma') return 'nenhum';
  if (alcanceFixo(e) === 'em você') return 'si';
  if (['zona', 'muro', 'cone', 'token', 'aura', 'linha'].includes(forma)) return 'ponto';
  return temPar(e, 'Alvos') ? 'varios' : 'um';
}

function gridDoEfeito(e) {
  const forma = formaDe(e);
  const ancora = ancoraDe(e, forma);
  let materia = null;
  for (const [t, ids] of Object.entries(MATERIA)) if (ids.includes(e.id)) materia = t;
  if (IGNORA_ARMADURA.includes(e.id)) materia = null;
  let condicao = null;
  for (const [c, ids] of Object.entries(CONDICAO)) if (ids.includes(e.id)) condicao = c;
  return {
    forma,
    ancora,
    gatilho: gatilhoDe(e, forma),
    alvo: alvoDe(e, forma, ancora),
    // Fica no tabuleiro entre um turno e outro? Sem Duração, o efeito acontece e
    // acaba, e não há o que desenhar depois.
    persiste: temPar(e, 'Duração') && forma !== 'nenhuma',
    // null = fenômeno puro, absorvido só pela Centelha.
    materia,
    condicao,
    // Marca uma peça do equipamento, e não o corpo.
    pegaItem: PEGA_ITEM.includes(e.id),
    // Cobre a arena inteira: escala de região, não área medida.
    arenaInteira: ARENA_INTEIRA.includes(e.id),
    // Escolhe um efeito já no tabuleiro, e não um chão nem um corpo.
    dissipa: DISSIPA.includes(e.id),
    fere: temPar(e, 'Dano'),
    cura: temPar(e, 'Cura'),
    // Pede rolagem de resistência de quem for pego.
    teste: temPar(e, 'Jogada') || temPar(e, 'Dificuldade'),
  };
}

// ==================================================================== checagem
const ids = new Set(EFEITOS.map((e) => e.id));
const condIds = new Set(CONDICOES.map((c) => c.id));
const erros = [];
const vistos = new Map();
const tabelas = [['FORMA', FORMA], ['GATILHO', GATILHO], ['MATERIA', MATERIA],
  ['ALVO', ALVO], ['CONDICAO', CONDICAO]];
for (const [tabela, grupos] of tabelas) {
  for (const [grupo, lista] of Object.entries(grupos)) {
    if (tabela === 'CONDICAO' && !condIds.has(grupo)) {
      erros.push(`CONDICAO: "${grupo}" não existe em condicoes.json`);
    }
    for (const id of lista) {
      if (!ids.has(id)) erros.push(`${tabela}.${grupo}: "${id}" não existe em efeitos.json`);
      const chave = `${tabela}:${id}`;
      if (vistos.has(chave)) erros.push(`${tabela}: "${id}" aparece em ${vistos.get(chave)} e em ${grupo}`);
      vistos.set(chave, grupo);
    }
  }
}
for (const id of IGNORA_ARMADURA) if (!ids.has(id)) erros.push(`IGNORA_ARMADURA: "${id}" não existe`);
for (const id of PEGA_ITEM) if (!ids.has(id)) erros.push(`PEGA_ITEM: "${id}" não existe`);
for (const id of ARENA_INTEIRA) if (!ids.has(id)) erros.push(`ARENA_INTEIRA: "${id}" não existe`);
for (const id of DISSIPA) if (!ids.has(id)) erros.push(`DISSIPA: "${id}" não existe`);
for (const a of ARTES) if (!COR[a.id]) erros.push(`COR: falta a cor da Arte "${a.id}"`);
if (erros.length) {
  console.error('✘ tabelas fora de dia:\n  ' + erros.join('\n  '));
  process.exit(1);
}

// ==================================================================== gravar
const artesNovas = ARTES.map((a) => ({ ...a, grid: gridDaArte(a) }));
const efeitosNovos = EFEITOS.map((e) => ({ ...e, grid: gridDoEfeito(e) }));

const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (process.argv.includes('--check')) {
  if (!igual(ARTES, artesNovas) || !igual(EFEITOS, efeitosNovos)) {
    console.error('✘ artes.json/efeitos.json estão sem o bloco `grid` em dia.\n'
      + '  Rode: node scripts/gen-grid-artes.mjs');
    process.exit(1);
  }
  console.log('✓ blocos `grid` em dia');
  process.exit(0);
}

writeFileSync(p('artes.json'), JSON.stringify(artesNovas, null, 2) + '\n');
writeFileSync(p('efeitos.json'), JSON.stringify(efeitosNovos, null, 2) + '\n');

// ==================================================================== relatório
const conta = (lista, chave) => lista.reduce((m, x) => {
  const k = x.grid[chave]; m[k] = (m[k] || 0) + 1; return m;
}, {});
const linha = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ');
console.log(`✓ ${artesNovas.length} Artes e ${efeitosNovos.length} Efeitos com bloco \`grid\``);
console.log('  forma:   ' + linha(conta(efeitosNovos, 'forma')));
console.log('  gatilho: ' + linha(conta(efeitosNovos, 'gatilho')));
console.log('  ferem: ' + efeitosNovos.filter((e) => e.grid.fere).length
  + ' · curam: ' + efeitosNovos.filter((e) => e.grid.cura).length
  + ' · persistem: ' + efeitosNovos.filter((e) => e.grid.persiste).length
  + ' · viram matéria: ' + efeitosNovos.filter((e) => e.grid.materia).length
  + ' · deixam condição: ' + efeitosNovos.filter((e) => e.grid.condicao).length
  + ' · pedem teste: ' + efeitosNovos.filter((e) => e.grid.teste).length);
if (process.argv.includes('--lista')) {
  for (const f of FORMAS) {
    const g = efeitosNovos.filter((e) => e.grid.forma === f);
    if (!g.length) continue;
    console.log(`\n── ${f} (${g.length})`);
    for (const e of g) {
      console.log(`   ${e.id.padEnd(26)} ${e.grid.ancora.padEnd(11)} ${e.grid.gatilho.padEnd(10)}`
        + `${e.grid.persiste ? 'dura ' : '     '}${e.grid.fere ? 'fere ' : '     '}`
        + `${(e.grid.materia || '').padEnd(11)}${e.grid.condicao || ''}`);
    }
  }
}
