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

function combatentePersona(persona, bloco, somaPers12) {
  const ficha = persona === 'pers1' ? fichaPers1(bloco)
    : persona === 'pers2' ? fichaPers2(bloco)
    : persona === 'pers4' ? fichaPers4(bloco)
    : fichaPers3(bloco, somaPers12);
  const r = L0.resumoCombatePC(ficha);
  const centelha = bloco.centelha;
  return {
    id: persona, nome: persona, tipo: 'persona',
    pv: BASE_PV, pvMax: BASE_PV,
    defesaBase: r.defesa + (bloco.proezas?.defesa || 0),
    soak: r.soak,
    ataque: r.ataque, dano: r.dano,
    tipoDano: tipoDaExpressao(r.dano) || 'impacto',
    ataqueBonusFlat: bloco.proezas?.ataque || 0,
    qaArmaBonus: r.qa.armaBonus, qaArmaDano: r.qa.armaDano,
    qaArmaduraBonus: r.qa.armaduraBonus, qaArmaduraReducao: r.qa.armaduraReducao,
    centelha,
    vontadeMax: ficha.willpower, vontadeRestante: ficha.willpower,
    ataca: persona !== 'pers3',
    ehSuporte: persona === 'pers3',
    nivelArtePers3: bloco.nivelArtePers3,
    manaMax: persona === 'pers3' ? L0.mana({ centelha, vontade: ficha.willpower }) : 0,
    manaRestante: persona === 'pers3' ? L0.mana({ centelha, vontade: ficha.willpower }) : 0,
    engajado: false, caido: false, coberto: false, curouAlguem: false,
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
  return {
    id, nome: ficha.nome, tipo: 'criatura',
    pv: mesa.combate.pv, pvMax: mesa.combate.pv,
    defesaBase: mesa.combate.defesa,
    soak: mesa.combate.absorcao,
    ataque: a0.pool, dano: a0.dano,
    tipoDano: tipoDanoBasico,
    qaArmaBonus: 0, qaArmaDano: 0, // simplificação (suposição 2): sem catálogo de arma natural
    fraquezas: elem.fraquezas, resistencias: elem.resistencias, imunidades: elem.imunidades,
    centelha: mesa.centelha, vontade: mesa.vontade,
    caster, arte: caster ? (ficha.arte || {}) : {},
    manaMax: caster ? L0.mana({ centelha: mesa.centelha, vontade: mesa.vontade }) : 0,
    manaRestante: caster ? L0.mana({ centelha: mesa.centelha, vontade: mesa.vontade }) : 0,
    poderes: (ficha.poderes || []).filter((p) => p.tipo === 'natural' && p.usos.periodo !== 'passivo'),
    voadoraOuDistancia,
    poderState: {}, // id -> { usosRestantes, cooldownTurnos }
    protecaoUsada: false, curaUsada: false, defesaExtra: 0,
  };
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

function escolherAcaoCriatura(c, turno, personas, engajadaId) {
  if (turno === 1 && c.arte.protecao && !c.protecaoUsada) return { tipo: 'protecao' };
  if (c.pv / c.pvMax < 0.3 && !c.curaUsada && c.arte.cura) return { tipo: 'cura-si' };
  const poder = c.poderes.find((p) => p.base && poderDisponivel(c, p, turno));
  if (poder) return { tipo: 'poder', poder };
  if (c.caster && c.manaRestante > 0) {
    const ofensivas = Object.entries(c.arte).filter(([id]) => id !== 'protecao' && id !== 'cura');
    if (ofensivas.length) {
      const [arteId, nivel] = ofensivas.reduce((m, x) => (x[1] > m[1] ? x : m));
      if (nivel <= c.manaRestante) return { tipo: 'arte', arteId, nivel };
    }
  }
  return { tipo: 'basico' };
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
      defesaBase: alvoStats.defesaBase, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0,
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

export function rodarBatalha(L, criaturaBase, centelha, seed, opts = {}) {
  const c = { ...structuredClone(criaturaBase), poderState: {} };
  const personas = grupoCombatentes(centelha);
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
    const acao = escolherAcaoCriatura(c, turno, personas, engajadaId);
    if (acao.tipo === 'protecao') {
      c.protecaoUsada = true; c.defesaExtra += 2; c.manaRestante -= Math.max(1, c.arte.protecao || 1);
    } else if (acao.tipo === 'cura-si') {
      const cura = L.curaDoEfeito(L.EFEITO['acelerar-a-cura'], c.arte.cura);
      c.pv = Math.min(c.pvMax, c.pv + (cura || 0));
      c.curaUsada = true; c.manaRestante -= (c.arte.cura || 1) * 2;
    } else {
      let dados, elemento = null, area = null, tipoDano = c.tipoDano, nivelUsado = null;
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
        // "Dano e projéteis" (regras.json → arcano.resistencia.tipos): não mirado, sem
        // rolagem de conjuração: resolve pela Dificuldade FIXA do Efeito (nível × 4)
        // contra a Defesa passiva do alvo, não pelo bolo de ataque da criatura (que é
        // só para o ataque FÍSICO dela). Implementa a regra escrita, não uma política
        // de bancada (decisão do Arquiteto, 30/09/2026, item 3).
        const dificuldadeFixa = nivelUsado != null ? nivelUsado * 4 : 0;
        const alvos = (area != null && area >= 10) ? personas.filter((p) => !p.caido) : [alvoDaCriatura(c, personas, engajadaId)];
        for (const alvo of alvos) {
          if (!alvo) continue;
          const saida = rolarContraDefesa(L, {
            ataqueExpr: '0d6', danoExpr: `${dados}d6`, ajusteFlat: dificuldadeFixa, ajusteDados: 0,
            qaArmaBonus: 0, qaArmaDano: 0, centelha: c.centelha, tipoDano,
          }, {
            defesaBase: alvo.defesaBase,
            soak: alvo.soak, pv: alvo.pv, pvMax: alvo.pvMax,
            qaArmaduraBonus: alvo.qaArmaduraBonus, qaArmaduraReducao: alvo.qaArmaduraReducao, centelha: alvo.centelha,
          }, fonte);
          let liquido = saida.danoLiquido;
          if (elemento) liquido = danoElementalNoAlvo(L, liquido, elemento, alvo).liquido;
          alvo.pv = Math.max(0, alvo.pv - liquido);
          if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
        }
      } else {
        // ataque básico
        const alvo = alvoDaCriatura(c, personas, engajadaId);
        if (alvo) {
          const saida = rolarContraDefesa(L, {
            ataqueExpr: c.ataque, danoExpr: c.dano, ajusteFlat: 0, ajusteDados: 0,
            qaArmaBonus: c.qaArmaBonus, qaArmaDano: c.qaArmaDano, centelha: c.centelha, tipoDano: c.tipoDano,
          }, {
            defesaBase: alvo.defesaBase, soak: alvo.soak, pv: alvo.pv, pvMax: alvo.pvMax,
            qaArmaduraBonus: alvo.qaArmaduraBonus, qaArmaduraReducao: alvo.qaArmaduraReducao, centelha: alvo.centelha,
          }, fonte);
          alvo.pv = Math.max(0, alvo.pv - saida.danoLiquido);
          if (alvo.pv <= 0 && !alvo.caido) { alvo.caido = true; if (alvo.id === engajadaId) promoverProximo(); }
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
      const atacaAgora = p.id === 'pers2' || p.id === engajadaId;
      if (!atacaAgora) continue;
      const grave = REGRAS.ferimentos.find((f) => {
        const pct = Math.max(1, Math.floor((p.pv / p.pvMax) * 100));
        return pct >= f.minPct && pct <= f.maxPct;
      })?.estado === 'Grave';
      let ajusteDados = 0, defesaBonus = 0;
      if (grave && p.vontadeRestante > 0) { defesaBonus = 4; p.vontadeRestante -= 1; }
      else if (p.vontadeRestante > 0) { ajusteDados = 1; p.vontadeRestante -= 1; }
      const saida = rolarContraDefesa(L, {
        ataqueExpr: p.ataque, danoExpr: p.dano, ajusteFlat: p.ataqueBonusFlat, ajusteDados,
        qaArmaBonus: p.qaArmaBonus, qaArmaDano: p.qaArmaDano, centelha: p.centelha, tipoDano: p.tipoDano,
      }, {
        defesaBase: c.defesaBase + c.defesaExtra, soak: c.soak, pv: c.pv, pvMax: c.pvMax,
        qaArmaduraBonus: 0, qaArmaduraReducao: 0, centelha: c.centelha,
      }, fonte);
      let liquido = saida.danoLiquido;
      liquido = danoElementalNoAlvo(L, liquido, p.tipoDano, c).liquido;
      c.pv = Math.max(0, c.pv - liquido);
      if (defesaBonus) { /* defesaBonus só valeria contra o golpe da criatura NO PRÓXIMO turno; aproximação: não reaplicado retroativamente. */ }
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

export { carregarCriatura, grupoCombatentes, L0 };
