// desafio-bancada.mjs · a bancada de desafio da Fase 5 (B14).
//
// Roteiro PRÓPRIO da bancada (decisão do Arquiteto, 29/09/2026): não usa nem altera
// `decisaoAutomatica` nem `motor.mjs` (são do Grid da mesa, fora de escopo). É um laço de
// TURNO (não de Tick: o próprio despacho fala em "turno"/"jogada", e "sem mapa"), que
// importa a resolução de golpe/dano/cura de `src/lib` pela mesma ponte do resto do
// harness (`lib-ponte.mjs`) e não reimplementa nenhuma fórmula de combate: só decide QUEM
// age e CONTRA QUEM, que é política de robô da medição, não regra de jogo nova.
//
// SUPOSIÇÕES DE MEDIÇÃO (tudo que o despacho não fixa em número, registrado aqui e no
// relato, nunca escondido):
//   1. TOLERÂNCIA: reserva de Vontade de cada persona (e o nível de Arte do Pers. 3, sem
//      número fixo no despacho): Centelha + 2. Proposto ao Arquiteto em 29/09/2026, sem
//      objeção até aqui.
//      LEVANTA QUANDO: o Arquiteto/autor decidir o número real dos dois.
//   2. CORRIGIDO em 30/09/2026 (decisão do Arquiteto, item 3): poder natural/Arte
//      ofensiva de "dano e projéteis" NÃO usa mais o bolo de ataque físico da criatura.
//      Usa a regra escrita (`regras.json → arcano.resistencia`): efeito não mirado, sem
//      rolagem de conjuração, resolvido pela Dificuldade FIXA do Efeito (nível × 4)
//      contra a Defesa passiva do alvo: a mesma `resolverGolpe`/quase-acerto de sempre,
//      só com o "bolo" do atacante fixo (`0d6 + nível×4`) em vez de rolado. O dano em si
//      continua por `nivel × dadoPorNivel` da Arte-base (a régua padrão do catálogo, sem
//      escolher parâmetro por parâmetro: isto continua simplificação).
//   3. Custo de Mana de toda conjuração desta bancada (Proteção, Cura em si mesma, Arte
//      ofensiva de recarga): 1 Mana por nível (2 na Cura, como o resto do sistema já
//      cobra). Não é o `custoDe` inteiro (que pede escolha de parâmetro a parâmetro);
//      é a aproximação mais simples que a régua do catálogo sustenta sem inventar Efeito.
//   4. "Arte de Proteção" vira +2 de Defesa permanente na criatura (efeito numérico único
//      já existente no sistema, análogo ao que a Arte de Proteção faz na mesa); Fascinação/
//      Morte/outras Artes de controle (dominar, paralisar) NÃO são modeladas como controle
//      nesta rodada, só como dano pela régua do item 2: perdem o efeito de controle.
//   5. Pers. 3 "dano em área da Centelha 3 em diante" (política iv, a de menor prioridade)
//      NÃO é modelado nesta rodada: o despacho não fixa qual Arte/Efeito ela usaria, e
//      inventar um aqui seria regra de jogo nova. Fica pendência.
//   6. Estabilizar não muda PV nem o estado "caído": a derrota do grupo já é definida por
//      "2 dos 4 caídos" (não por morte), então estabilizar não altera o resultado desta
//      bancada especificamente: a ação é registrada, mas sem efeito numérico aqui.
//   7. Poder natural "passivo/contínuo" (aura permanente, ex.: Aura de fogo) não é
//      modelado como ação discreta: sem um gatilho de turno claro no despacho, fica de
//      fora, listado por criatura no relato.
//   8. Alvo da Arte ofensiva de recarga ("contra o alvo mais perigoso"): mesma regra de
//      alvo da política 1 (persona engajada, ou a mais ferida se a criatura for à
//      distância/alcance longo/voadora), por não haver uma métrica de "perigo" definida.
import { carregarLib, ligar } from './lib-ponte.mjs';
import { tipoDaExpressao } from './elenco.mjs';
import { grupoDeReferencia } from './desafio-personas.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import REGRAS from '../../src/data/regras.json' with { type: 'json' };

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BASE_PV = REGRAS.derivados.pv.base + 3 * REGRAS.derivados.pv.vigorMult;
const TICKS_POR_TURNO = 6;

// As criaturas que conjuram Arte de verdade "como classe" (item 3 do despacho da Fase 4).
// Reconhecidas por CATEGORIA (dragões) ou por ID (as nomeadas).
const CASTERS_ID = new Set([
  'mon-lich', 'mon-couatl', 'mon-ninfa', 'mon-planetar', 'mon-solar', 'mon-ghaele',
  'mon-rakshasa', 'mon-naga',
]);
const ehCaster = (ficha) => ficha.categoria === 'Dragão' || CASTERS_ID.has(ficha.id);

const L0 = await carregarLib();
ligar(L0);

const soNumero = (s) => {
  const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

// ============================================================== fichas de referência
function fichaPersonaBase(bloco) {
  return {
    attrs: { forca: 2, destreza: 2, vigor: 3, influencia: 2, perspicacia: 2, compostura: 2, percepcao: 2, inteligencia: 2, raciocinio: 2 },
    skills: { armas: 0, esquiva: 0, prontidao: 2, atletismo: 2, resistencia: 0, furtividade: 0, sobrevivencia: 0, integridade: 0, investigacao: 0, empatia: 0, ocultismo: 0, conhecimentos: 0 },
    skills2: {},
    virtues: { compaixao: 2, conviccao: 3, temperanca: 2, valor: 3 },
    willpower: bloco.centelha + 2, // TOLERÂNCIA (suposição 1) · LEVANTA QUANDO: decisão do Arquiteto.
    aparencia: 3,
    centelha: bloco.centelha,
    conjuntos: [],
    equip: { armaduras: bloco.armaduraId === 'nenhuma' ? [] : [{ base: bloco.armaduraId, vestida: true }] },
  };
}

function fichaPers1(bloco) {
  const f = fichaPersonaBase(bloco);
  f.attrs.forca = bloco.atributo; f.attrs.destreza = bloco.atributo;
  f.skills.armas = bloco.habilidade; f.skills.esquiva = bloco.habilidade; f.skills.atletismo = bloco.habilidade;
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:espada-longa' }, inabil: { ref: 'e:broquel' } }];
  return f;
}
function fichaPers2(bloco) {
  const f = fichaPersonaBase(bloco);
  f.attrs.forca = bloco.atributo; f.attrs.destreza = bloco.atributo;
  f.skills.armas = bloco.habilidade; f.skills.esquiva = bloco.habilidade; f.skills.atletismo = bloco.habilidade;
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:arco-longo' }, inabil: { ref: 'nada' } }];
  return f;
}
function fichaPers4(bloco) {
  const f = fichaPersonaBase(bloco);
  f.attrs.forca = bloco.atributo; f.attrs.destreza = bloco.atributo;
  f.skills.armas = bloco.habilidade; f.skills.esquiva = bloco.habilidade; f.skills.atletismo = bloco.habilidade;
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:adaga' }, inabil: { ref: 'nada' } }];
  return f;
}
// Pers. 3 não ataca; usa o MESMO piso de soma dos Pers. 1/2 na Centelha, desarmada, só
// para ter Defesa/PV comparáveis (o despacho não dá números próprios para ela).
function fichaPers3(bloco, somaBase) {
  const f = fichaPersonaBase(bloco);
  const atributo = Math.ceil(somaBase / 2), habilidade = Math.floor(somaBase / 2);
  f.attrs.forca = atributo; f.attrs.destreza = atributo;
  f.skills.esquiva = habilidade; f.skills.atletismo = habilidade;
  f.skills2.briga = habilidade;
  f.conjuntos = [{ ativo: true, habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' } }];
  return f;
}

// Arma usada por cada persona, para Rajada/dupla (`combate.md:137-173`). Pers.2 (arco,
// classe `distancia`) e Pers.3 (não ataca) ficam sem arma de corpo a corpo: nenhuma das
// duas puxa Rajada (a regra escrita já barra à distância, `rajada.corpoACorpo`) nem dupla
// (arco ocupa as duas mãos). Pers.1 e Pers.4 não têm segunda arma equipada (Pers.1 leva
// broquel; Pers.4 vai com a mão inábil vazia), então nenhuma persona desta bancada tem
// dupla disponível: só Rajada, quando a arma permitir.
const ARMA_POR_PERSONA = { pers1: 'espada-longa', pers2: 'arco-longo', pers4: 'adaga' };

function combatentePersona(persona, bloco, somaPers12) {
  const ficha = persona === 'pers1' ? fichaPers1(bloco)
    : persona === 'pers2' ? fichaPers2(bloco)
    : persona === 'pers4' ? fichaPers4(bloco)
    : fichaPers3(bloco, somaPers12);
  const r = L0.resumoCombatePC(ficha);
  const centelha = bloco.centelha;
  const armaId = ARMA_POR_PERSONA[persona] || null;
  const classe = armaId ? L0.classeDeTempo(armaId, null, null) : null;
  const velocidade = armaId ? L0.velocidadeDaArma(armaId, 5) : null;
  // Para a leitura alternativa da Guarda sob pressão ("cai na Habilidade", Fase 5b,
  // Adendo item 2): guarda os componentes crus e a penalidade de armadura/escudo já
  // embutida em `r.defesa`, pra recompor a Defesa com a Habilidade reduzida quando
  // `GUARDA_MODO==='habilidade'`.
  const destrezaRaw = ficha.attrs.destreza;
  const esquivaRaw = ficha.skills.esquiva;
  const penFisica = (destrezaRaw + esquivaRaw) * (REGRAS.derivados.defesa.mult ?? 2)
    + 2 * Math.min(Math.max(0, centelha), Math.max(0, esquivaRaw)) - r.defesa;
  return {
    id: persona, nome: persona, tipo: 'persona',
    pv: BASE_PV, pvMax: BASE_PV,
    defesaBase: r.defesa + (bloco.proezas?.defesa || 0),
    proezasDefesaAplicada: bloco.proezas?.defesa || 0,
    proezasAtual: bloco.proezas?.defesa || 0,
    destrezaRaw, esquivaRaw, penFisica,
    soak: r.soak,
    ataque: r.ataque, dano: r.dano,
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    ataqueBonusFlat: bloco.proezas?.ataque || 0,
    qaArmaBonus: r.qa.armaBonus, qaArmaDano: r.qa.armaDano,
    qaArmaduraBonus: r.qa.armaduraBonus, qaArmaduraReducao: r.qa.armaduraReducao,
    centelha, classe, velocidade,
    vontadeMax: ficha.willpower, vontadeRestante: ficha.willpower,
    ataca: persona !== 'pers3',
    ehSuporte: persona === 'pers3',
    nivelArtePers3: bloco.nivelArtePers3,
    manaMax: persona === 'pers3' ? L0.mana({ centelha, vontade: ficha.willpower }) : 0,
    manaRestante: persona === 'pers3' ? L0.mana({ centelha, vontade: ficha.willpower }) : 0,
    engajado: false, caido: false, coberto: false, curouAlguem: false,
    pressao: 0, atrasoTicks: 0,
  };
}

function grupoCombatentes(centelha) {
  const blocos = grupoDeReferencia(centelha);
  const somaPers12 = blocos.find((b) => b.persona === 'pers1').atributo + blocos.find((b) => b.persona === 'pers1').habilidade;
  return blocos.map((b) => combatentePersona(b.persona, b, somaPers12));
}

// ============================================================== ficha da criatura
function carregarCriatura(id) {
  const ficha = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/bestiario', `${id}.json`), 'utf8'));
  const bruto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/monsters-mesa.json'), 'utf8'));
  const MON = Array.isArray(bruto) ? bruto : (bruto.lista || Object.values(bruto).find(Array.isArray) || []);
  const mesa = MON.find((m) => m.id === id);
  if (!mesa) throw new Error(`${id} não está em monsters-mesa.json`);
  const elem = L0.elementosCombate(mesa);
  const a0 = mesa.combate.ataques[0];
  const caster = ehCaster(ficha);
  const voadoraOuDistancia = !!(ficha.locomocao?.voo) || mesa.combate.ataques.some((a) => a.speed && /arco|sopro/i.test(a.nome || ''));
  // CORRIGIDO em 30/09/2026: `tipoDaExpressao` só lê o sufixo "(C)/(I)/(P)" que as fichas
  // de PC usam; o bestiário escreve o tipo por extenso ("perfurante") no próprio dano E
  // no campo `tipo` do ataque-fonte (ataqueSchema). Ler do dano com `tipoDaExpressao`
  // sempre caía no fallback 'impacto', trocando a Absorção usada contra toda criatura (achado
  // conferindo o pedido do Arquiteto sobre dano/Absorção, 30/09/2026). A fonte certa é
  // `ficha.ataques[0].tipo`, mapeado para o vocabulário de `soak` ('perfurante'→'perfuracao').
  const TIPO_PARA_SOAK = { perfurante: 'perfuracao', corte: 'corte', impacto: 'impacto' };
  const tipoDanoBasico = TIPO_PARA_SOAK[ficha.ataques?.[0]?.tipo] || tipoDaExpressao(a0.dano) || 'impacto';
  // Componentes crus pra leitura alternativa da Guarda sob pressão (ver combatentePersona).
  const destrezaRaw = ficha.attrs.destreza;
  const esquivaRaw = ficha.skills.esquiva ?? 0;
  const penFisica = (destrezaRaw + esquivaRaw) * (REGRAS.derivados.defesa.mult ?? 2)
    + 2 * Math.min(Math.max(0, mesa.centelha), Math.max(0, esquivaRaw)) - mesa.combate.defesa;
  return {
    id, nome: ficha.nome, tipo: 'criatura',
    pv: mesa.combate.pv, pvMax: mesa.combate.pv,
    defesaBase: mesa.combate.defesa,
    destrezaRaw, esquivaRaw, penFisica,
    soak: mesa.combate.absorcao,
    ataque: a0.pool, dano: a0.dano,
    tipoDano: tipoDanoBasico,
    qaArmaBonus: 0, qaArmaDano: 0, // simplificação (suposição 2): sem catálogo de arma natural
    fraquezas: elem.fraquezas, resistencias: elem.resistencias, imunidades: elem.imunidades,
    centelha: mesa.centelha, vontade: mesa.vontade,
    caster, arte: caster ? (ficha.arte || {}) : {},
    manaMax: caster ? L0.mana({ centelha: mesa.centelha, vontade: mesa.vontade }) : 0,
    manaRestante: caster ? L0.mana({ centelha: mesa.centelha, vontade: mesa.vontade }) : 0,
    // "passivo" já fora (aura contínua, não é ação de turno). Dois achados rodando a
    // matriz das 9 âncoras (30/09/2026):
    //  1. `morte-explosiva` (Balor) tem `base` (entrava no pool de ataques ativos) mas o
    //     `efeito` é um GATILHO DE MORTE ("ao cair a 0 PV..."), não algo que a criatura
    //     escolhe usar. Sem exclusão, o Balor escolhia "morte-explosiva" todo turno
    //     (nunca fica indisponível: `avontade` sem `quantidade` nem `recarga`) e NUNCA
    //     atacava de verdade, travando a batalha em censura total.
    //  2. Poder com `base` e `resiste: 'nenhum'` não é dano-e-projétil: é utilidade
    //     (teleporte, convocar, reproduzir Arte, regenerar). Rolar Nd6 contra a Defesa
    //     pra essas seria dano inventado onde a ficha não descreve dano nenhum. Afeta
    //     Balor (teleporte-balor), Diabo do Fosso (convocar-diabos, feiticos-supremos),
    //     Solar (convocar-anjos), Tarrasca (regeneracao-implacavel).
    // Não modelo gatilho de morte nem essas utilidades (seria mecânica nova); só tiro as
    // duas categorias do pool de ataque ativo.
    poderes: (ficha.poderes || []).filter((p) => p.tipo === 'natural' && p.usos.periodo !== 'passivo'
      && p.resiste !== 'nenhum' && !/ao cair a 0 ?PV/i.test(p.efeito || '')),
    voadoraOuDistancia,
    classe: a0.classe || 'leve', velocidade: a0.speed || 5,
    poderState: {}, // id -> { usosRestantes, cooldownTurnos }
    protecaoUsada: false, curaUsada: false, defesaExtra: 0,
    pressao: 0, atrasoTicks: 0,
    // Vontade defensiva (política 4) é só das personas nesta bancada; sem isto,
    // `vontadeDefesa()` leria `vontadeRestante` indefinido (NaN <= 0 é falso) e daria um
    // +4 de Defesa de graça pra criatura quando ela está Grave, achado unificando
    // `resolverGolpeFisico` pros dois lados (Fase 5b, 01/10/2026).
    vontadeRestante: 0, semVontadeDefesa: true,
  };
}

/**
 * VARIANTE A2 (matriz pedida pelo Arquiteto, 30/09/2026): Habilidade de ataque =
 * máx(Habilidade real, Centelha), só dentro da bancada, pra que `2×mín(Centelha,
 * Habilidade)` vire `2×Centelha` sem o teto do gerador antigo (que travou a Briga em 5
 * em quase toda âncora, item 2b do relato anterior). Recomputa o pool do zero pela MESMA
 * fórmula do gerador (`rolagemAtaque`, `src/lib/bestia-editor.ts`), não uma aproximação:
 * dados = ⌊(Atrib+HabEfetiva)/2⌋, flat = acerto-base + 2×mín(Centelha,HabEfetiva).
 */
function criaturaA2(id, criaturaBase) {
  const ficha = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/bestiario', `${id}.json`), 'utf8'));
  const a0 = ficha.ataques[0];
  const atrib = ficha.attrs[a0.atrib] || 0;
  const habReal = (ficha.skills && ficha.skills[a0.pericia]) ?? (ficha.skills2 && ficha.skills2[a0.pericia]) ?? 0;
  const centelha = ficha.centelha;
  const habEf = Math.max(habReal, centelha);
  const soma = atrib + habEf;
  const dados = Math.floor(soma / 2);
  const mais = soma % 2 === 1 ? 2 : 0;
  const acerto = (a0.acerto || 0) + 2 * Math.min(centelha, habEf);
  const pool = `${dados}d6${mais ? '+2' : ''}${acerto ? ` +${acerto}` : ''}`;
  return { ...criaturaBase, ataque: pool };
}

function poderNivel(p, L0arte) {
  if (!p.base) return null;
  const arte = L0.ARTE[p.base.arte];
  const dadoPorNivel = arte?.grid?.dadoPorNivel || 1;
  return { dados: p.base.nivel * dadoPorNivel, nivel: p.base.nivel, arteId: p.base.arte };
}

function areaMetros(p) {
  if (!p.area) return null;
  return soNumero(p.area);
}

// ============================================================= o turno da criatura
//
// `periodo` decide o TIPO de limite (achado depurando o filhote de dragão: com
// "ticks"/"recarga" tratado como teto vitalício, o sopro de fogo só saía UMA vez em
// toda a batalha, e o grupo vencia cedo demais). "dia"/"cena"/"hora"/"avontade": teto
// vitalício da batalha (a cena = a batalha). "ticks"/"golpe": disponível de novo assim
// que o cooldown (a `recarga`) passa, sem teto vitalício.
const PERIODO_VITALICIO = new Set(['dia', 'cena', 'hora', 'avontade']);
function poderDisponivel(c, p, turno) {
  const st = c.poderState[p.id] || { usosRestantes: p.usos.quantidade ?? Infinity, cooldownAte: 0 };
  c.poderState[p.id] = st;
  if (PERIODO_VITALICIO.has(p.usos.periodo) && st.usosRestantes <= 0) return false;
  if (turno < st.cooldownAte) return false;
  return true;
}
function consumirPoder(c, p, turno) {
  const st = c.poderState[p.id];
  if (PERIODO_VITALICIO.has(p.usos.periodo)) st.usosRestantes -= 1;
  if (p.usos.recarga) {
    const ticks = soNumero(p.usos.recarga) || 0;
    st.cooldownAte = turno + Math.max(1, Math.round(ticks / TICKS_POR_TURNO));
  }
}

function alvoDaCriatura(c, personas, engajadaId) {
  if (c.voadoraOuDistancia) {
    const vivos = personas.filter((p) => !p.caido);
    return vivos.reduce((pior, p) => (p.pv / p.pvMax < pior.pv / pior.pvMax ? p : pior), vivos[0]);
  }
  return personas.find((p) => p.id === engajadaId) || personas.find((p) => !p.caido);
}

// ============================================================= dano esperado (exato)
//
// CORRIGIDO em 30/09/2026 (decisão do Arquiteto, item 1): a escolha de ação passa a
// comparar o DANO ESPERADO de cada opção (ataque básico e cada poder/Arte ofensiva
// disponível), não mais "sempre prefere poder" nem "poder de maior nível". Achado
// investigando o Diabo do Fosso: o ataque básico dele acertaria 99,99% do Pers.1 C0 e
// causaria 22 de dano médio, mas a escolha antiga nunca considerava essa opção porque
// sempre preferia QUALQUER poder com `base`. Dano esperado = chance de acerto × dano
// líquido médio (com o piso do raspão), somado sobre os alvos atingidos se for área.
// Cálculo EXATO por convolução dos dados (mesma conta do `desafio-diagnostico.mjs`), não
// aproximação: é barato (pools de até ~13d6) e evita viés de amostra pequena na escolha.
function pmfDado(n) {
  let pmf = new Map([[0, 1]]);
  for (let i = 0; i < n; i++) {
    const novo = new Map();
    for (const [s, p] of pmf) for (let f = 1; f <= 6; f++) {
      const ns = s + f; novo.set(ns, (novo.get(ns) || 0) + p / 6);
    }
    pmf = novo;
  }
  return pmf;
}
const PMF_CACHE = new Map();
function pmfDadoCache(n) {
  if (!PMF_CACHE.has(n)) PMF_CACHE.set(n, pmfDado(n));
  return PMF_CACHE.get(n);
}
function parseExprSimples(expr) {
  const m = String(expr).match(/^(\d+)d6(\+2)?\s*(.*)$/);
  if (!m) return { n: 0, flat: 0 };
  const n = Number(m[1]);
  let flat = m[2] ? 2 : 0;
  for (const mm of m[3].matchAll(/([+−-])\s*(\d+)/g)) flat += (mm[1] === '+' ? 1 : -1) * Number(mm[2]);
  return { n, flat };
}
/**
 * Quantos dados o pool tem depois do ajuste (Rajada/dupla tiram dado, nunca somam aqui).
 * MESMA REGRA de `dadosAjustados` (`src/lib/rolagem.ts`): pool não-vazio nunca cai abaixo
 * de 1 dado; pool já vazio (`0d6`, ex.: a Dificuldade fixa de poder/Arte) continua vazio.
 */
function dadosComAjuste(n, ajusteDados) {
  return n > 0 ? Math.max(1, n + ajusteDados) : Math.max(0, n + ajusteDados);
}
/**
 * Dano líquido médio por golpe (com acerto/raspão/erro), contra UM alvo. `ajusteDados`
 * é a penalidade de Rajada/dupla no POOL DE ACERTO (negativo, nunca no dano: a Margem é
 * que cresce o dano, e o pool de dano não leva a penalidade de golpes múltiplos).
 * `defesaEfetiva` já vem pronta de `defesaComPressao` (Guarda sob pressão aplicada).
 */
function danoEsperadoContra(ataqueExpr, danoExpr, atacanteQa, alvo, tipoDano, ajusteDados, defesaEfetiva) {
  const margemQA = atacanteQa.qaArmaBonus + (alvo.qaArmaduraBonus ?? 0);
  const danoQA = Math.max(0, atacanteQa.qaArmaDano - (alvo.qaArmaduraReducao ?? 0) + atacanteQa.centelha - alvo.centelha);
  const at = parseExprSimples(ataqueExpr);
  const pmfAtaque = pmfDadoCache(dadosComAjuste(at.n, ajusteDados));
  let pAcerto = 0, pRaspao = 0;
  for (const [soma6, p] of pmfAtaque) {
    const total = soma6 + at.flat;
    const falta = defesaEfetiva - total + 1;
    if (falta <= 0) pAcerto += p;
    else if (falta <= margemQA) pRaspao += p;
  }
  const dn = parseExprSimples(danoExpr);
  const pmfDano = pmfDadoCache(dn.n);
  const soak = alvo.soak[tipoDano] ?? 0;
  let danoLiquidoSeAcerto = 0;
  for (const [somaD, p] of pmfDano) {
    const bruto = Math.max(0, somaD + dn.flat);
    danoLiquidoSeAcerto += p * Math.max(danoQA, bruto - soak, 0);
  }
  return pAcerto * danoLiquidoSeAcerto + pRaspao * Math.max(0, danoQA);
}
/** Dano esperado somado sobre os alvos atingidos (área ≥10m atinge todos os vivos). */
function danoEsperadoOpcao(ataqueExpr, danoExpr, atacanteQa, alvos, tipoDano) {
  return alvos.reduce((s, alvo) => s + danoEsperadoContra(ataqueExpr, danoExpr, atacanteQa, alvo, tipoDano, 0, defesaComPressao(alvo)), 0);
}
/**
 * Guarda sob pressão (`combate.md:405`): cada ataque QUE O ALVO RECEBE (ou, na leitura
 * escrita, também os que ele FAZ, mas nem `combate-tempo.ts` nem `grid.astro` somam esse
 * lado: sigo o código, não o texto solto) reduz a guarda em 2, acumulando até a próxima
 * ação do alvo, sem teto. `alvo.pressao` é a CONTAGEM de ataques (não o já multiplicado).
 *
 * DUAS LEITURAS de ONDE o −2 entra (Fase 5b, Adendo do autor, 01/10/2026, pedindo as duas
 * atrás de uma chave): o autor pediu confirmação entre colchetes; `GUARDA_MODO` decide, e
 * o padrão é o que ele escolheu.
 *   'defesaFinal' (PADRÃO): o −2 cai na Defesa já pronta, por fora da fórmula; NÃO mexe
 *     na Habilidade nem no teto `2×mín(Centelha,Habilidade)`.
 *   'habilidade': o −2 cai na própria Habilidade (Esquiva/Bloqueio) ANTES da fórmula,
 *     então reduz também o teto da Centelha (`2×mín(Centelha,Habilidade−pressão)`).
 * Para trocar: editar a constante abaixo. É a "UMA chave" pedida pelo Adendo: nenhuma
 * bandeira de CLI nova, só esta constante de módulo.
 */
const GUARDA_MODO = 'defesaFinal'; // 'defesaFinal' | 'habilidade'
const PRESSAO_POR_ATAQUE = REGRAS.combate.escada.pressaoPorAtaque ?? -2;
function defesaComPressao(alvo) {
  // Chave de medição (despacho da Fase 5b, item 5: efeito isolado da Guarda sob
  // pressão): `alvo.semGuarda` desliga o termo inteiro, pra comparar com/sem.
  const pressao = alvo.semGuarda ? 0 : (alvo.pressao || 0);
  if (GUARDA_MODO === 'habilidade' && alvo.destrezaRaw != null) {
    const habilidadeEfetiva = Math.max(0, alvo.esquivaRaw + pressao * (PRESSAO_POR_ATAQUE / 2));
    return L0.defesa({ destreza: alvo.destrezaRaw, habilidade: habilidadeEfetiva, centelha: alvo.centelha })
      - alvo.penFisica + (alvo.proezasAtual || 0);
  }
  return alvo.defesaBase + pressao * PRESSAO_POR_ATAQUE;
}
/** Dano esperado de uma manobra de vários golpes (Rajada/dupla), somando golpe a golpe,
 * já com a Guarda sob pressão de quem avalia a escolha (aproximação: a pressão do alvo
 * no INÍCIO da ação, sem reprojetar golpe a golpe dentro da própria estimativa). */
function danoEsperadoManobra(ataqueExpr, danoExpr, atacanteQa, alvo, tipoDano, penDados) {
  const defesaEfetiva = defesaComPressao(alvo);
  return penDados.reduce((s, pd) => s + danoEsperadoContra(ataqueExpr, danoExpr, atacanteQa, alvo, tipoDano, pd, defesaEfetiva), 0);
}

/**
 * B14 Fase 5b (01/10/2026): Rajada e empunhadura dupla (`combate.md:137-173`), pelos
 * dois lados, escolhidas por dano esperado junto com as outras opções. `classe`/
 * `velocidade` decidem o teto de golpes e os Ticks extra (`L0.tetoDaRajada`,
 * `L0.anatomia`); nenhum número novo, só a conta que já existe em `src/lib`.
 *
 * `temDupla`: só a criatura tem (interpretação, ver relato: "duas armas naturais, uma
 * por pata" vira DUAS repetições do MESMO perfil de ataque, porque a ficha não separa
 * mordida de garra). Nenhuma persona desta bancada tem segunda arma equipada (Pers.1 leva
 * escudo, Pers.4 vai com a mão livre), então `temDupla` é sempre falso para persona.
 */
function opcoesMultiGolpe(classe, velocidade, temDupla) {
  if (!classe || !velocidade) return [];
  const opcoes = [];
  const simples = L0.anatomia({ classe, velocidade, sistema: 'normal', manobra: 'simples' });
  const teto = L0.tetoDaRajada(classe);
  for (let golpes = 2; golpes <= teto; golpes++) {
    const an = L0.anatomia({ classe, velocidade, sistema: 'normal', manobra: 'rajada', golpes });
    if (an.golpes < 2) continue; // a régua forçou n=1 (distância: `rajada.corpoACorpo`)
    opcoes.push({ manobra: 'rajada', golpes: an.golpes, penDados: an.penDados, cicloExtra: an.ciclo - simples.ciclo });
  }
  if (temDupla) {
    const an = L0.anatomia({ classe, velocidade, sistema: 'normal', manobra: 'dupla' });
    opcoes.push({ manobra: 'dupla', golpes: an.golpes, penDados: an.penDados, cicloExtra: an.ciclo - simples.ciclo });
  }
  return opcoes;
}

function escolherAcaoCriatura(c, turno, personas, engajadaId) {
  if (c.atrasoTicks > 0) return { tipo: 'esperar' }; // ainda pagando Ticks de Rajada
  if (turno === 1 && c.arte.protecao && !c.protecaoUsada) return { tipo: 'protecao' };
  if (c.pv / c.pvMax < 0.3 && !c.curaUsada && c.arte.cura) return { tipo: 'cura-si' };

  const alvoUnico = [alvoDaCriatura(c, personas, engajadaId)].filter(Boolean);
  const alvosVivos = personas.filter((p) => !p.caido);
  const qaCriatura = { qaArmaBonus: c.qaArmaBonus, qaArmaDano: c.qaArmaDano, centelha: c.centelha };

  const opcoes = [];
  opcoes.push({ tipo: 'basico', manobra: 'simples', penDados: [0], dano: danoEsperadoOpcao(c.ataque, c.dano, qaCriatura, alvoUnico, c.tipoDano) });
  if (alvoUnico[0]) {
    // "Criatura com garras = duas armas naturais, uma por pata" (despacho item 4): a
    // ficha não separa mordida de garra, então a Rajada e a "dupla" reusam o MESMO
    // perfil de `ataques[0]` (interpretação, não um segundo golpe inventado).
    for (const mg of opcoesMultiGolpe(c.classe, c.velocidade, true)) {
      opcoes.push({
        tipo: 'basico', manobra: mg.manobra, golpes: mg.golpes, penDados: mg.penDados, cicloExtra: mg.cicloExtra,
        dano: danoEsperadoManobra(c.ataque, c.dano, qaCriatura, alvoUnico[0], c.tipoDano, mg.penDados),
      });
    }
    // VARIANTE "Ataque total" (despacho item 3, só quando `c.ataqueTotal` liga): mordida
    // e as duas garras na mesma ação (3 golpes, MESMO perfil repetido, mesma
    // interpretação da dupla), sem a penalidade de −1d6 da Rajada, 1 uso a cada 3
    // turnos. Poder Especial de variante, não ficha: só entra quando pedido.
    if (c.ataqueTotal && (c.ataqueTotalCooldown ?? 0) <= turno) {
      opcoes.push({
        tipo: 'ataque-total', manobra: 'ataque-total', golpes: 3, penDados: [0, 0, 0], cicloExtra: 0,
        dano: danoEsperadoManobra(c.ataque, c.dano, qaCriatura, alvoUnico[0], c.tipoDano, [0, 0, 0]),
      });
    }
  }

  for (const p of c.poderes) {
    if (!p.base || p.resiste === 'nenhum' || !poderDisponivel(c, p, turno)) continue;
    const nv = poderNivel(p);
    if (!nv) continue;
    const area = areaMetros(p);
    const alvos = (area != null && area >= 10) ? alvosVivos : alvoUnico;
    const dificuldadeFixa = nv.nivel * 4;
    const dano = danoEsperadoOpcao(`0d6 +${dificuldadeFixa}`, `${nv.dados}d6`, { ...qaCriatura, qaArmaBonus: 0, qaArmaDano: 0 }, alvos, c.tipoDano);
    opcoes.push({ tipo: 'poder', poder: p, dano });
  }

  if (c.caster && c.manaRestante > 0) {
    for (const [arteId, nivel] of Object.entries(c.arte)) {
      if (arteId === 'protecao' || arteId === 'cura' || nivel > c.manaRestante) continue;
      const arte = L0.ARTE[arteId];
      const dados = nivel * (arte?.grid?.dadoPorNivel || 1);
      const dificuldadeFixa = nivel * 4;
      const dano = danoEsperadoOpcao(`0d6 +${dificuldadeFixa}`, `${dados}d6`, { ...qaCriatura, qaArmaBonus: 0, qaArmaDano: 0 }, alvoUnico, c.tipoDano);
      opcoes.push({ tipo: 'arte', arteId, nivel, dano });
    }
  }

  const melhor = opcoes.reduce((m, o) => (o.dano > m.dano ? o : m), opcoes[0]);
  if (melhor.tipo === 'poder') { return { tipo: 'poder', poder: melhor.poder }; }
  if (melhor.tipo === 'arte') { return { tipo: 'arte', arteId: melhor.arteId, nivel: melhor.nivel }; }
  if (melhor.tipo === 'ataque-total') {
    return { tipo: 'ataque-total', manobra: melhor.manobra, penDados: melhor.penDados, cicloExtra: 0 };
  }
  return { tipo: 'basico', manobra: melhor.manobra, penDados: melhor.penDados, cicloExtra: melhor.cicloExtra || 0 };
}

function rolarContraDefesa(L, atacante, alvoStats, fonte) {
  const qa = L.quaseAcertoDoEncontro({
    atacante: { qaArmaBonus: atacante.qaArmaBonus, qaArmaDano: atacante.qaArmaDano, centelha: atacante.centelha },
    alvo: { qaArmaduraBonus: alvoStats.qaArmaduraBonus ?? 0, qaArmaduraReducao: alvoStats.qaArmaduraReducao ?? 0, centelha: alvoStats.centelha },
  });
  return L.resolverGolpe({
    aid: 'x', atacante: {
      ataque: atacante.ataqueExpr, dano: atacante.danoExpr,
      ajusteFlat: atacante.ajusteFlat || 0, ajusteDados: atacante.ajusteDados || 0,
      penDados: [0], qaArmaBonus: atacante.qaArmaBonus, qaArmaDano: atacante.qaArmaDano,
      centelha: atacante.centelha,
    },
    alvo: {
      defesaBase: alvoStats.defesaBase, ferimento: 0, condicoesDefesa: 0,
      defesaPerdida: alvoStats.defesaPerdida ?? 0,
      soak: alvoStats.soak[atacante.tipoDano] ?? 0, pv: alvoStats.pv, pvMax: alvoStats.pvMax,
      qaArmaduraBonus: alvoStats.qaArmaduraBonus ?? 0, qaArmaduraReducao: alvoStats.qaArmaduraReducao ?? 0,
      centelha: alvoStats.centelha,
    },
    manobra: 'simples', golpeIndice: 0, distanciaHex: null, tipoDano: atacante.tipoDano,
    modManual: 0, margemQA: qa.margem, danoQA: qa.dano,
  }, fonte);
}

/** Dano de um poder/Arte no alvo, já com fraqueza/resistência/imunidade. */
function danoElementalNoAlvo(L, danoBruto, elemento, alvo) {
  return L.danoNoAlvo({
    bruto: danoBruto, elemento, materia: elemento,
    soakArmadura: 0, soakNatural: 0,
    fraquezas: alvo.fraquezas || [], resistencias: alvo.resistencias || [], imunidades: alvo.imunidades || [],
  });
}

/**
 * Vontade defensiva (política 4 do despacho): +4 na Defesa quando Grave, 1 por jogada,
 * até a reserva acabar. CORRIGIDO em 30/09/2026: antes era calculado mas nunca aplicado
 * (dead code, comentário antigo "não reaplicado retroativamente"). Agora aplica de
 * verdade, no momento em que a CRIATURA mira no alvo, que é quando a Defesa dele importa.
 */
function vontadeDefesa(alvo) {
  if (alvo.semVontadeDefesa || alvo.vontadeRestante <= 0) return 0;
  const pct = Math.max(1, Math.floor((alvo.pv / alvo.pvMax) * 100));
  const grave = REGRAS.ferimentos.find((f) => pct >= f.minPct && pct <= f.maxPct)?.estado === 'Grave';
  if (!grave) return 0;
  alvo.vontadeRestante -= 1;
  return 4;
}

/**
 * Resolve UM golpe físico, atacante → alvo, com Guarda sob pressão (`combate.md:405`) e
 * Vontade defensiva. `ajusteDados` é a penalidade de Rajada/dupla no acerto deste golpe
 * (`penDados[i]`). Incrementa `alvo.pressao` em 1 ao final (cada ataque RECEBIDO, ver
 * `defesaComPressao`), seja acerto, raspão ou erro: é a mesma régua do `resolverContra`
 * do motor da mesa (`pressao: (base.pressao||0)+1`, sem checar veredito).
 */
function resolverGolpeFisico(L, fonte, atacante, alvo, ajusteDados) {
  const vDef = vontadeDefesa(alvo);
  const saida = rolarContraDefesa(L, {
    ataqueExpr: atacante.ataqueExpr, danoExpr: atacante.danoExpr,
    ajusteFlat: atacante.ajusteFlat || 0, ajusteDados,
    qaArmaBonus: atacante.qaArmaBonus, qaArmaDano: atacante.qaArmaDano, centelha: atacante.centelha,
    tipoDano: atacante.tipoDano,
  }, {
    defesaBase: defesaComPressao(alvo) + vDef,
    soak: alvo.soak, pv: alvo.pv, pvMax: alvo.pvMax,
    qaArmaduraBonus: alvo.qaArmaduraBonus ?? 0, qaArmaduraReducao: alvo.qaArmaduraReducao ?? 0, centelha: alvo.centelha,
  }, fonte);
  let liquido = saida.danoLiquido;
  liquido = danoElementalNoAlvo(L, liquido, atacante.elemento ?? null, alvo).liquido;
  alvo.pv = Math.max(0, alvo.pv - liquido);
  alvo.pressao = (alvo.pressao || 0) + 1;
  return liquido;
}

export function rodarBatalha(L, criaturaBase, centelha, seed, opts = {}) {
  const c = { ...structuredClone(criaturaBase), poderState: {} };
  // VARIANTE "Ataque total" (despacho item 3, 01/10/2026): só entra quando pedida
  // explicitamente; é um Poder Especial de teste, não parte da base.
  c.ataqueTotal = !!opts.ataqueTotal;
  c.semGuarda = !!opts.semGuardaPressao;
  const personas = grupoCombatentes(centelha);
  if (opts.semGuardaPressao) for (const p of personas) p.semGuarda = true;
  // VARIANTE B2 da FASE 5 (30/09/2026, agora só de referência histórica): Pers.1 sem
  // Proezas de Defesa E sem Vontade na Defesa, as duas juntas.
  if (opts.semDefesaExtraPers1) {
    const pers1 = personas.find((p) => p.id === 'pers1');
    if (pers1) { pers1.defesaBase -= pers1.proezasDefesaAplicada || 0; pers1.proezasAtual = 0; pers1.semVontadeDefesa = true; }
  }
  // BASE NOVA da FASE 5b (Adendo do autor, 01/10/2026): "não é a B2 antiga". Pers.1 fica
  // SEM Proezas de Defesa, mas COM Vontade na Defesa (o traço Força de Vontade real,
  // `willpower`, continua valendo). Só tira Proezas; não mexe em `semVontadeDefesa`.
  if (opts.semProezasPers1) {
    const pers1 = personas.find((p) => p.id === 'pers1');
    if (pers1) { pers1.defesaBase -= pers1.proezasDefesaAplicada || 0; pers1.proezasAtual = 0; }
  }
  L.semear(L.semeadoDe(seed));
  const fonte = L.fonteRolada;
  let engajadaId = personas.find((p) => p.ataca)?.id; // pers1
  if (engajadaId) personas.find((p) => p.id === engajadaId).engajado = true;
  const ordemPromocao = ['pers4', 'pers2', 'pers3'];

  const caidas = () => personas.filter((p) => p.caido).length;
  const promoverProximo = () => {
    const at = personas.find((p) => p.id === engajadaId);
    if (at) at.engajado = false;
    engajadaId = ordemPromocao.find((id) => {
      const p = personas.find((x) => x.id === id);
      return p && !p.caido;
    });
    if (engajadaId) personas.find((p) => p.id === engajadaId).engajado = true;
  };

  const TETO = opts.teto ?? 60;
  let turno = 0, fim = null;
  while (!fim && turno < TETO) {
    turno += 1;
    if (caidas() >= 2) { fim = 'grupo-caiu'; break; }
    if (c.pv <= 0) { fim = 'criatura-caiu'; break; }

    // ---- turno da criatura ----
    // O relógio de Ticks passa pra todo mundo a cada turno (TICKS_POR_TURNO=6), e é
    // esse decaimento que consome o atraso que a Rajada acumulou.
    c.atrasoTicks = Math.max(0, c.atrasoTicks - TICKS_POR_TURNO);
    const acao = escolherAcaoCriatura(c, turno, personas, engajadaId);
    if (acao.tipo === 'esperar') {
      // Ainda pagando Ticks de uma Rajada anterior: não age, não zera a própria pressão
      // (ela só zera "quando você age", `combate.md:405`/`declarar()`).
    } else {
      c.pressao = 0; // zera ao agir (mesmo gatilho de `declarar()` em combate-tempo.ts)
      if (acao.tipo === 'protecao') {
        c.protecaoUsada = true; c.defesaExtra += 2; c.manaRestante -= Math.max(1, c.arte.protecao || 1);
      } else if (acao.tipo === 'cura-si') {
        const cura = L.curaDoEfeito(L.EFEITO['acelerar-a-cura'], c.arte.cura);
        c.pv = Math.min(c.pvMax, c.pv + (cura || 0));
        c.curaUsada = true; c.manaRestante -= (c.arte.cura || 1) * 2;
      } else if (acao.tipo === 'basico' || acao.tipo === 'ataque-total') {
        c.atrasoTicks += acao.cicloExtra || 0;
        if (acao.tipo === 'ataque-total') c.ataqueTotalCooldown = turno + 3; // "1 uso a cada 3 turnos"
        for (const pd of acao.penDados) {
          const alvo = alvoDaCriatura(c, personas, engajadaId);
          if (!alvo) break;
          resolverGolpeFisico(L, fonte, {
            ataqueExpr: c.ataque, danoExpr: c.dano, ajusteFlat: 0,
            qaArmaBonus: c.qaArmaBonus, qaArmaDano: c.qaArmaDano, centelha: c.centelha, tipoDano: c.tipoDano,
          }, alvo, pd);
          if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
          if (caidas() >= 2) break;
        }
      } else {
        // poder/Arte ofensiva: "dano e projéteis" (regras.json → arcano.resistencia.tipos),
        // não mirado, sem rolagem de conjuração, Dificuldade fixa (nível×4) contra a
        // Defesa (decisão do Arquiteto, 30/09/2026, item 3). Sem Rajada/dupla: não é um
        // golpe de arma, é um disparo só por turno.
        let dados, elemento = null, area = null, nivelUsado = null;
        if (acao.tipo === 'poder') {
          consumirPoder(c, acao.poder, turno);
          const nv = poderNivel(acao.poder);
          dados = nv ? nv.dados : null;
          elemento = nv?.arteId || null;
          nivelUsado = nv?.nivel ?? null;
          area = areaMetros(acao.poder);
        } else if (acao.tipo === 'arte') {
          const arte = L.ARTE[acao.arteId];
          dados = acao.nivel * (arte?.grid?.dadoPorNivel || 1);
          elemento = acao.arteId;
          nivelUsado = acao.nivel;
          c.manaRestante -= acao.nivel;
        }
        if (dados) {
          const dificuldadeFixa = nivelUsado != null ? nivelUsado * 4 : 0;
          const alvos = (area != null && area >= 10) ? personas.filter((p) => !p.caido) : [alvoDaCriatura(c, personas, engajadaId)];
          for (const alvo of alvos) {
            if (!alvo) continue;
            resolverGolpeFisico(L, fonte, {
              ataqueExpr: '0d6', danoExpr: `${dados}d6`, ajusteFlat: dificuldadeFixa,
              qaArmaBonus: 0, qaArmaDano: 0, centelha: c.centelha, tipoDano: c.tipoDano, elemento,
            }, alvo, 0);
            if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
          }
        }
      }
    }
    if (caidas() >= 2) { fim = 'grupo-caiu'; break; }
    if (c.pv <= 0) { fim = 'criatura-caiu'; break; }

    // ---- turno das personas ----
    for (const p of personas) {
      if (p.caido) continue;
      if (p.id === 'pers3') {
        const machucado = personas.find((x) => !x.caido && x.pv / x.pvMax < 0.3);
        if (machucado && p.centelha > 0 && p.manaRestante >= (p.nivelArtePers3 * 2)) {
          const cura = L.curaDoEfeito(L.EFEITO['acelerar-a-cura'], p.nivelArtePers3);
          machucado.pv = Math.min(machucado.pvMax, machucado.pv + (cura || 0));
          p.manaRestante -= p.nivelArtePers3 * 2;
        } else if (personas.some((x) => x.caido)) {
          // Estabilizar (suposição 6): registrado, sem efeito numérico.
        } else {
          const pers2 = personas.find((x) => x.id === 'pers2');
          if (pers2 && !pers2.coberto) { pers2.defesaBase += 2; pers2.coberto = true; }
        }
        continue;
      }
      p.atrasoTicks = Math.max(0, p.atrasoTicks - TICKS_POR_TURNO);
      const atacaAgora = p.id === 'pers2' || p.id === engajadaId;
      if (!atacaAgora || p.atrasoTicks > 0) continue;
      p.pressao = 0; // zera ao agir
      // Política 4: se Grave, reserva a Vontade pra Defesa (gasta de verdade em
      // `vontadeDefesa()`, quando a criatura mirar nele); senão, gasta em +1d6 aqui.
      const pctP = Math.max(1, Math.floor((p.pv / p.pvMax) * 100));
      const graveAgora = REGRAS.ferimentos.find((f) => pctP >= f.minPct && pctP <= f.maxPct)?.estado === 'Grave';
      let bonusVontade = 0;
      if (!graveAgora && p.vontadeRestante > 0) { bonusVontade = 1; p.vontadeRestante -= 1; }
      const atacanteStats = {
        ataqueExpr: p.ataque, danoExpr: p.dano, ajusteFlat: p.ataqueBonusFlat,
        qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha, tipoDano: p.tipoDano,
        elemento: p.tipoDano, // fraqueza/resistência/imunidade física da criatura, ver carregarCriatura
      };
      const alvoCriatura = { ...c, defesaBase: c.defesaBase + c.defesaExtra };
      // Rajada (`combate.md:137-155`), só Pers.1/Pers.4 (Pers.2 é à distância: a régua
      // escrita barra Rajada à distância, item 1 do despacho; nenhuma persona tem
      // segunda arma pra dupla). Escolhida por dano esperado, junto do golpe simples.
      const multi = opcoesMultiGolpe(p.classe, p.velocidade, false);
      let manobra = { manobra: 'simples', golpes: 1, penDados: [0], cicloExtra: 0 };
      if (multi.length) {
        let melhorDano = danoEsperadoManobra(p.ataque, p.dano, { qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha }, alvoCriatura, p.tipoDano, [0]);
        for (const mg of multi) {
          const d = danoEsperadoManobra(p.ataque, p.dano, { qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha }, alvoCriatura, p.tipoDano, mg.penDados);
          if (d > melhorDano) { melhorDano = d; manobra = mg; }
        }
      }
      p.atrasoTicks += manobra.cicloExtra || 0;
      for (let i = 0; i < manobra.penDados.length; i++) {
        if (c.pv <= 0) break;
        resolverGolpeFisico(L, fonte, atacanteStats, alvoCriatura, manobra.penDados[i] + (i === 0 ? bonusVontade : 0));
        c.pv = alvoCriatura.pv; c.pressao = alvoCriatura.pressao;
      }
    }
    if (caidas() >= 2) { fim = 'grupo-caiu'; break; }
    if (c.pv <= 0) { fim = 'criatura-caiu'; break; }
  }
  if (!fim) fim = 'censura';
  return {
    fim, turnos: turno, venceuGrupo: fim === 'criatura-caiu', resolvida: fim !== 'censura',
    caidasNoFim: caidas(), pvCriaturaNoFim: c.pv,
  };
}

/**
 * BANDO (despacho item 4, 01/10/2026): N criaturas INDIVIDUAIS, cada uma com sua própria
 * ação, PV, pressão e cooldown de poder, contra o grupo de referência. É a definição de
 * `maisUm`/"quantos iguais" do despacho original ("Fase 5", não "5b"): N peças
 * separadas, nunca a Regra de Horda (`combate.md:409`, Magnitude), que o despacho desta
 * rodada pede para NÃO aplicar, só registrar que não foi usada.
 *
 * Política (decisões de robô, não regra de jogo, nenhuma delas no despacho):
 *   - vitória do bando só quando TODAS as N criaturas caem (PV ≤ 0);
 *   - toda criatura mira a persona ENGAJADA (política 1 do despacho da Fase 5: nenhum
 *     lobo/worg é voador/à distância, então já seria essa a escolha de `alvoDaCriatura`);
 *   - as personas sempre mirando a criatura VIVA MAIS FERIDA (foco de fogo), não uma
 *     escolhida ao acaso nem dividida por igual;
 *   - a ordem dentro do turno é a mesma do 1×1 (criaturas agem, depois as personas), e
 *     isto importa pra pilha de Guarda sob pressão: um bando de N golpeando a MESMA
 *     persona empilha N pontos de pressão nela antes mesmo das personas agirem.
 * Base nova (Adendo, 01/10/2026): aceita `opts.semProezasPers1` como `rodarBatalha`
 * (Pers.1 sem Proezas de Defesa, COM Vontade real); sem variante (nem A2, nem Ataque
 * total): o próprio despacho pede "base nova, sem variante".
 */
export function rodarBatalhaBando(L, criaturaBase, n, centelha, seed, opts = {}) {
  const criaturas = Array.from({ length: n }, () => ({
    ...structuredClone(criaturaBase), poderState: {}, ataqueTotal: false, semGuarda: !!opts.semGuardaPressao,
  }));
  const personas = grupoCombatentes(centelha);
  if (opts.semGuardaPressao) for (const p of personas) p.semGuarda = true;
  if (opts.semDefesaExtraPers1) {
    const pers1 = personas.find((p) => p.id === 'pers1');
    if (pers1) { pers1.defesaBase -= pers1.proezasDefesaAplicada || 0; pers1.proezasAtual = 0; pers1.semVontadeDefesa = true; }
  }
  if (opts.semProezasPers1) {
    const pers1 = personas.find((p) => p.id === 'pers1');
    if (pers1) { pers1.defesaBase -= pers1.proezasDefesaAplicada || 0; pers1.proezasAtual = 0; }
  }
  L.semear(L.semeadoDe(seed));
  const fonte = L.fonteRolada;
  let engajadaId = personas.find((p) => p.ataca)?.id;
  if (engajadaId) personas.find((p) => p.id === engajadaId).engajado = true;
  const ordemPromocao = ['pers4', 'pers2', 'pers3'];

  const caidasPersonas = () => personas.filter((p) => p.caido).length;
  const vivasCriaturas = () => criaturas.filter((x) => x.pv > 0);
  const promoverProximo = () => {
    const at = personas.find((p) => p.id === engajadaId);
    if (at) at.engajado = false;
    engajadaId = ordemPromocao.find((id) => { const p = personas.find((x) => x.id === id); return p && !p.caido; });
    if (engajadaId) personas.find((p) => p.id === engajadaId).engajado = true;
  };
  const maisFerida = () => vivasCriaturas().reduce((pior, x) => (x.pv / x.pvMax < pior.pv / pior.pvMax ? x : pior), vivasCriaturas()[0]);

  const TETO = opts.teto ?? 60;
  let turno = 0, fim = null;
  while (!fim && turno < TETO) {
    turno += 1;
    if (caidasPersonas() >= 2) { fim = 'grupo-caiu'; break; }
    if (!vivasCriaturas().length) { fim = 'bando-caiu'; break; }

    // ---- turno do bando: cada criatura viva age, na ordem do array ----
    for (const c of criaturas) {
      if (c.pv <= 0) continue;
      c.atrasoTicks = Math.max(0, c.atrasoTicks - TICKS_POR_TURNO);
      const acao = escolherAcaoCriatura(c, turno, personas, engajadaId);
      if (acao.tipo === 'esperar') continue;
      c.pressao = 0;
      if (acao.tipo === 'basico' || acao.tipo === 'ataque-total') {
        c.atrasoTicks += acao.cicloExtra || 0;
        for (const pd of acao.penDados) {
          const alvo = alvoDaCriatura(c, personas, engajadaId);
          if (!alvo) break;
          resolverGolpeFisico(L, fonte, {
            ataqueExpr: c.ataque, danoExpr: c.dano, ajusteFlat: 0,
            qaArmaBonus: c.qaArmaBonus, qaArmaDano: c.qaArmaDano, centelha: c.centelha, tipoDano: c.tipoDano,
          }, alvo, pd);
          if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
          if (caidasPersonas() >= 2) break;
        }
      } else if (acao.tipo === 'poder') {
        consumirPoder(c, acao.poder, turno);
        const nv = poderNivel(acao.poder);
        if (nv) {
          const area = areaMetros(acao.poder);
          const alvos = (area != null && area >= 10) ? personas.filter((p) => !p.caido) : [alvoDaCriatura(c, personas, engajadaId)];
          const dificuldadeFixa = nv.nivel * 4;
          for (const alvo of alvos) {
            if (!alvo) continue;
            resolverGolpeFisico(L, fonte, {
              ataqueExpr: '0d6', danoExpr: `${nv.dados}d6`, ajusteFlat: dificuldadeFixa,
              qaArmaBonus: 0, qaArmaDano: 0, centelha: c.centelha, tipoDano: c.tipoDano, elemento: nv.arteId,
            }, alvo, 0);
            if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
          }
        }
      }
      if (caidasPersonas() >= 2) break;
    }
    if (caidasPersonas() >= 2) { fim = 'grupo-caiu'; break; }
    if (!vivasCriaturas().length) { fim = 'bando-caiu'; break; }

    // ---- turno das personas: foco de fogo na criatura viva mais ferida ----
    for (const p of personas) {
      if (p.caido) continue;
      if (p.id === 'pers3') {
        const machucado = personas.find((x) => !x.caido && x.pv / x.pvMax < 0.3);
        if (machucado && p.centelha > 0 && p.manaRestante >= (p.nivelArtePers3 * 2)) {
          const cura = L.curaDoEfeito(L.EFEITO['acelerar-a-cura'], p.nivelArtePers3);
          machucado.pv = Math.min(machucado.pvMax, machucado.pv + (cura || 0));
          p.manaRestante -= p.nivelArtePers3 * 2;
        } else if (personas.some((x) => x.caido)) {
          // Estabilizar (suposição 6): registrado, sem efeito numérico.
        } else {
          const pers2 = personas.find((x) => x.id === 'pers2');
          if (pers2 && !pers2.coberto) { pers2.defesaBase += 2; pers2.coberto = true; }
        }
        continue;
      }
      p.atrasoTicks = Math.max(0, p.atrasoTicks - TICKS_POR_TURNO);
      const atacaAgora = p.id === 'pers2' || p.id === engajadaId;
      if (!atacaAgora || p.atrasoTicks > 0) continue;
      const alvo = maisFerida();
      if (!alvo) continue;
      p.pressao = 0;
      const pctP = Math.max(1, Math.floor((p.pv / p.pvMax) * 100));
      const graveAgora = REGRAS.ferimentos.find((f) => pctP >= f.minPct && pctP <= f.maxPct)?.estado === 'Grave';
      let bonusVontade = 0;
      if (!graveAgora && p.vontadeRestante > 0) { bonusVontade = 1; p.vontadeRestante -= 1; }
      const atacanteStats = {
        ataqueExpr: p.ataque, danoExpr: p.dano, ajusteFlat: p.ataqueBonusFlat,
        qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha, tipoDano: p.tipoDano,
        elemento: p.tipoDano,
      };
      const multi = opcoesMultiGolpe(p.classe, p.velocidade, false);
      let manobra = { manobra: 'simples', golpes: 1, penDados: [0], cicloExtra: 0 };
      if (multi.length) {
        let melhorDano = danoEsperadoManobra(p.ataque, p.dano, { qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha }, alvo, p.tipoDano, [0]);
        for (const mg of multi) {
          const d = danoEsperadoManobra(p.ataque, p.dano, { qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha }, alvo, p.tipoDano, mg.penDados);
          if (d > melhorDano) { melhorDano = d; manobra = mg; }
        }
      }
      p.atrasoTicks += manobra.cicloExtra || 0;
      for (let i = 0; i < manobra.penDados.length; i++) {
        if (alvo.pv <= 0) break;
        resolverGolpeFisico(L, fonte, atacanteStats, alvo, manobra.penDados[i] + (i === 0 ? bonusVontade : 0));
      }
    }
    if (caidasPersonas() >= 2) { fim = 'grupo-caiu'; break; }
    if (!vivasCriaturas().length) { fim = 'bando-caiu'; break; }
  }
  if (!fim) fim = 'censura';
  return {
    fim, turnos: turno, venceuGrupo: fim === 'bando-caiu', resolvida: fim !== 'censura',
    caidasNoFim: caidasPersonas(), criaturasVivasNoFim: vivasCriaturas().length,
  };
}

export function wilson(k, n, z = 1.959964) {
  if (!n) return { p: null, lo: null, hi: null, n };
  const p = k / n, z2 = z * z, den = 1 + z2 / n;
  const meio = (p + z2 / (2 * n)) / den;
  const margem = z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n) / den;
  return { p, lo: meio - margem, hi: meio + margem, n };
}

export function rodarCentelha(id, centelha, reps, semente) {
  const criatura = carregarCriatura(id);
  const rs = [];
  for (let i = 0; i < reps; i++) rs.push(rodarBatalha(L0, criatura, centelha, semente + i * 7919));
  const resolvidas = rs.filter((r) => r.resolvida);
  const vitorias = resolvidas.filter((r) => r.venceuGrupo).length;
  return { ...wilson(vitorias, resolvidas.length), censura: 1 - resolvidas.length / rs.length, total: rs.length };
}

export function desafioDe(id, reps, semente) {
  const curva = [0, 1, 2, 3, 4, 5, 6].map((c) => ({ centelha: c, ...rodarCentelha(id, c, reps, semente) }));
  const acha = curva.find((x) => x.p != null && x.p >= 0.8);
  return { curva, desafio: acha ? acha.centelha : null };
}

export { carregarCriatura, criaturaA2, grupoCombatentes, L0 };
