// lib-bestiario.mjs · a ficha de criatura (src/data/bestiario/<id>.json) e a conta
// que sai dela. Compartilhado por gen-bestiario.mjs (o stat block), gen-monsters.mjs
// (o card e a mesa), migrar-bestiario.mjs (a migração de 26/09/2026) e pelo
// validate-data.mjs. O formato está descrito em docs/bestiario/ficha-criatura.md.
//
// DESDE O B14 (fase 1) NADA AQUI LÊ `ameaca` PARA MONTAR A FICHA. O papel, as
// perícias, a Vontade, a Aparência e as Virtudes que antes saíam do desafio estão
// ESCRITOS em cada arquivo, com o valor que tinham; `ameacaLegada` só viaja até o
// inimigos.json e o card, para exibir, até a calibração nova.
import fs from 'node:fs';
import path from 'node:path';
import { achataCatalogo } from './lib-equip.mjs';

export const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
export const PASTA = path.join(ROOT, 'src/data/bestiario');
const ler = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));
const regras = ler('regras.json');
const D = regras.derivados;
const fl = Math.floor;
const ARMAD = Object.fromEntries(achataCatalogo(ler('armaduras.json')).map((a) => [a.id, a]));
const SOAKCATS = ['impacto', 'corte', 'perfuracao'];
const cNoSoak = regras.dano?.centelhaNoSoak ?? 0;
// Soak natural por modo: Impacto = Vigor cheio; letais = metade do Vigor.
const soakNat = (vigor, modo) => (modo === 'impacto' ? vigor : fl(vigor / 2));

export const ATRIBUTOS = ['forca', 'destreza', 'vigor', 'influencia', 'perspicacia', 'compostura', 'percepcao', 'inteligencia', 'raciocinio'];

// ------------------------------------------------------------------- o porte
// O arquivo guarda o RÓTULO ("Médio", "Enorme"), o mesmo que o card mostra. A
// conta (PV, couraça, furtividade) usa o slug. Rótulo desconhecido cai em Médio,
// como sempre caiu.
const PORTE_NORM = { miudo: 'minusculo', minusculo: 'minusculo', pequeno: 'pequeno', medio: 'medio', grande: 'grande', enorme: 'enorme', imenso: 'imenso', colossal: 'colossal' };
export const NORM = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const porteSlug = (rotulo) => PORTE_NORM[NORM(rotulo)] || 'medio';

// PV escalado por porte: base + Vigor×mult da tabela regras.derivados.pv.porte (Médio = default).
function pvDe(slug, vigor) {
  const t = (D.pv.porte && D.pv.porte[slug]) || { base: D.pv.base, vigorMult: D.pv.vigorMult };
  return t.base + vigor * t.vigorMult;
}
// Couraça de porte: Absorção extra (só letais) + R.Perf natural (gate), da tabela
// regras.dano.couracaPorte. O campo `couraca` do arquivo SUBSTITUI a da tabela
// (o roc: pássaro imenso, pura massa, sem couraça natural).
const COURACA = regras.dano?.couracaPorte || {};
const couracaDe = (b) => b.couraca || COURACA[b.porteSlug] || { couraca: 0, resistPerf: 0 };

// ------------------------------------------------------------ o stat block
// build compacta → stat block calculado. Igual ao de antes do B14, com o porte e
// a couraça vindos do próprio objeto em vez de mapas por id.
export function stat(b) {
  const at = { forca: 2, destreza: 2, vigor: 2, influencia: 2, perspicacia: 2, compostura: 2, percepcao: 2, inteligencia: 2, raciocinio: 2, ...b.attrs };
  const pe = b.pericias || {};
  const arm = ARMAD[b.armadura || 'nenhuma'] || ARMAD['nenhuma'];
  const C = b.centelha || 0;
  const pv = pvDe(b.porteSlug, at.vigor);
  const espEsq = (b.especialidades && b.especialidades.esquiva) || 0;
  const defesa = (at.destreza + (pe.esquiva || 0)) * D.defesa.mult + espEsq + C * (D.defesa.centelhaMult ?? 1) - (arm.penalidade || 0);
  const integ = pe.integridade ?? b.integridade ?? 2;
  const intel = at.inteligencia;
  // Defesa Mental: Raciocínio + Integridade + Vontade + Centelha (soma simples). Só p/ quem tem mente (Int ≥ 1); Int 0 é imune ("-").
  const defesaMental = intel <= 0 ? '-'
    : integ * D.defesaMental.mult + (D.defesaMental.maisRaciocinio ? at.raciocinio : 0) + (D.defesaMental.maisVontade ? (b.vontade ?? 5) : 0) + (D.defesaMental.maisCentelha ? C * (D.defesaMental.centelhaMult ?? 1) : 0);
  // Defesa Social: escudo social geral (resiste a influência e a leitura). Int 0 = "-" (sem trato
  // social nenhum); Int 1 (feras) troca Sociabilidade por Sobrevivência (B14 fase 2, item C.7);
  // Int ≥ 2 usa Sociabilidade, ou a melhor perícia social que o bloco tenha. Centelha fica fora do ×2.
  const socialSkill = intel >= 2
    ? (pe.sociabilidade ?? Math.max(0, pe.oratoria || 0, pe.manha || 0, pe.persuasao || 0, pe.lideranca || 0, pe.politica || 0))
    : (pe.sobrevivencia || 0);
  const espSoc = (b.especialidades && b.especialidades.social) || 0;
  const defesaSocial = intel >= 1 ? (at.compostura + socialSkill) * D.defesaSocial.mult + C * (D.defesaSocial.centelhaMult ?? 0) + espSoc : '-';
  const ini = at.raciocinio + (pe.prontidao || 0);
  const ataques = (b.ataques || []).map((a) => {
    const soma = (at[a.atrib] || 0) + (pe[a.pericia] || 0);
    const dados = fl(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const acerto = (a.acerto || 0) + C * (D.ataque?.centelhaMult ?? 0);
    const pool = `${dados}d6${bonus ? '+2' : ''}${acerto ? ` +${acerto}` : ''}`;
    const fm = D.danoForca; const forcaAp = a.mao === 2 ? at.forca * fm.duasMaos : at.forca * fm.umaMao;
    const fa = (a.distancia && !a.arremesso) ? 0 : forcaAp;
    const perf = a.perf ?? a.pen;
    const dano = `${a.dado}d6${fa ? ` +${fa}` : ''} ${a.tipo}${perf != null ? ` · perf. ${perf}` : ''}`;
    // O NÍVEL DE PERFURAÇÃO como campo numérico, e não só dentro da string do
    // `dano`: é dele que o gate (`gatePerfuracaoAbre`) lê, do mesmo jeito que lê
    // `perfArma` do lado do PC (`combate-resumo.ts`). `null` quando o ataque não
    // é Perfurante, e não Nível 0 (que resvalaria em qualquer armadura).
    const perfArma = a.tipo === 'perfurante' ? (perf ?? 0) : null;
    return { nome: a.nome, pool, dano, perfArma, ticks: a.ticks, ...(a.notas ? { notas: a.notas } : {}) };
  });
  const cv = couracaDe(b);
  const soak = Object.fromEntries(SOAKCATS.map((m) => {
    const base = soakNat(at.vigor, m) + C * cNoSoak + (arm.soak?.[m] ?? 0);
    return [m, base + (m === 'impacto' ? 0 : cv.couraca)]; // couraça de porte só nos letais
  }));
  const resistPerf = Math.max(arm.resistPerf ?? 0, cv.resistPerf ?? 0);
  const out = {
    id: b.id, nome: b.nome, tipo: b.tipo,
    categoria: b.categoria || catFromTags(b.tags || []),
    ameaca: b.ameaca, centelha: C,
    conceito: b.conceito, descricao: b.descricao, tags: b.tags || [],
    pv, defesa, defesaSocial, defesaMental, vontade: b.vontade ?? 5,
    soak, resistPerf,
    iniciativa: `1d6 + ${ini}`,
    atributos: at, ataques,
    tecnicas: b.tecnicas || [], artes: b.artes || [],
    notas: b.notas || '', pendente: b.pendente ?? false,
  };
  if (b.poderes && b.poderes.length) out.poderes = b.poderes;

  // Bônus nos valores fixos. Existem porque nem toda criatura cabe na fórmula: um
  // couro grosso, uma casca, um corpo que simplesmente aguenta mais. O bônus SOMA
  // ao calculado em vez de substituí-lo, então a criatura continua ancorada na
  // régua e a diferença fica visível para quem for reequilibrar depois.
  const bn = b.bonus || {};
  if (bn.pv) out.pv += bn.pv;
  if (bn.defesa) out.defesa += bn.defesa;
  if (bn.defesaSocial && out.defesaSocial !== '-') out.defesaSocial += bn.defesaSocial;
  if (bn.defesaMental && out.defesaMental !== '-') out.defesaMental += bn.defesaMental;
  if (bn.vontade) out.vontade += bn.vontade;
  if (bn.resistPerf) out.resistPerf += bn.resistPerf;
  if (bn.iniciativa) out.iniciativa = `1d6 + ${ini + bn.iniciativa}`;
  if (bn.absorcao) for (const m of SOAKCATS) out.soak[m] += bn.absorcao;
  for (const m of SOAKCATS) if (bn[`absorcao_${m}`]) out.soak[m] += bn[`absorcao_${m}`];
  return out;
}
// categoria dos NPCs feitos à mão (pelos tags), quando não vem explícita
function catFromTags(tags) {
  if (tags.includes('morto-vivo') || tags.includes('espírito')) return 'Morto-vivo';
  if (tags.includes('gigante')) return 'Gigante';
  if (tags.includes('fera')) return 'Fera';
  if (tags.includes('arcano')) return 'Conjurador';
  return 'Humano';
}

/**
 * AS PERÍCIAS QUE SAEM NO inimigos.json, e este bloco existe por um achado de 04/09/2026.
 *
 * Elas NÃO são o `skills` do arquivo: são a conta invertida dos derivados, e a
 * redundância é de propósito (as catorze regras de oposição pedem a PERÍCIA pelo
 * nome; o motor continua lendo `defesa`, `defesaMental` e `iniciativa`):
 *
 *   Prontidão     = iniciativa − raciocínio
 *   Esquiva       = defesa/2 − destreza − centelha/2   (some com armadura no meio)
 *   Integridade   = defesaMental − raciocínio − vontade − centelha   (some sem mente)
 *   Sociabilidade = (defesaSocial − centelha)/2 − compostura   (some com Int 0; Int 1 é Sobrevivência por baixo)
 *
 * A Furtividade vem da tabela por porte e categoria (`regras.furtividadeCriatura`),
 * com exceção por id no próprio regras.json. ONDE A CONTA NÃO FECHA, a perícia sai
 * OMITIDA e não zerada: `esquiva: 0` quer dizer "não esquiva", a ausência quer
 * dizer "não dá para saber daqui".
 */
const FURT = regras.furtividadeCriatura || {};
function furtividadeDe(x, slug) {
  // A EXCECAO e { valor, porque }, e o `porque` nao e enfeite: ver a nota do
  // campo. O numero solto tambem e aceito, para quem escrever com pressa.
  const ex = (FURT.excecoes || {})[x.id];
  if (typeof ex === 'number') return ex;
  if (ex && typeof ex.valor === 'number') return ex.valor;
  const base = (FURT.porte || {})[NORM(slug)];
  if (typeof base !== 'number') return undefined;
  let v = base + ((FURT.categoria || {})[x.categoria] || 0);
  for (const t of (x.tags || [])) v += (FURT.tags || {})[t] || 0;
  return Math.max(0, Math.min(6, v));
}
export function periciasDe(x, slug) {
  const at = x.atributos || {};
  const C = x.centelha || 0;
  const V = x.vontade || 0;
  const inteiro = (n) => (Number.isFinite(n) && Number.isInteger(n) && n >= 0 ? n : undefined);
  const bonusIni = (() => {
    const m = /\+\s*(-?\d+)/.exec(String(x.iniciativa || ''));
    return m ? parseInt(m[1], 10) : null;
  })();
  const p = {
    prontidao: bonusIni == null ? undefined : inteiro(bonusIni - (at.raciocinio || 0)),
    esquiva: typeof x.defesa === 'number'
      ? inteiro(x.defesa / 2 - (at.destreza || 0) - C / 2) : undefined,
    integridade: typeof x.defesaMental === 'number'
      ? inteiro(x.defesaMental - (at.raciocinio || 0) - V - C) : undefined,
    sociabilidade: typeof x.defesaSocial === 'number'
      ? inteiro((x.defesaSocial - C) / 2 - (at.compostura || 0)) : undefined,
    furtividade: furtividadeDe(x, slug),
  };
  const saida = {};
  for (const k of Object.keys(p)) if (p[k] !== undefined) saida[k] = p[k];
  return saida;
}

// ------------------------------------------------------------ o deslocamento
// O arquivo guarda `locomocao` por modo, em m/Tick. A peça do Grid anda pelo
// `terra`; sem ele, pelo maior dos outros (o falcão voa, o tubarão nada). As
// três velocidades da mesa saem do passo escolhido pela régua humana, a mesma do
// gen-deslocamento.mjs: arranque ≈ ×1,6 e corrida ≈ ×2,3, sem inverter a ordem.
export const MODOS = ['terra', 'voo', 'natacao', 'escalada', 'escavacao'];
export function passoDaPeca(loc) {
  if (!loc) return null;
  if (Number.isFinite(loc.terra)) return loc.terra;
  const outros = MODOS.map((m) => loc[m]).filter(Number.isFinite);
  return outros.length ? Math.max(...outros) : null;
}
export function tres(batalha) {
  const arranque = Math.max(batalha, Math.round(batalha * 1.6));
  const corrida = Math.max(arranque, Math.round(batalha * 2.3));
  return { batalha, arranque, corrida };
}

// ------------------------------------------------- o padrão por tipo (PF)
// Aparência e Virtudes de partida pela natureza (ecologia.tipo). Nas 309 do livro
// elas estão ESCRITAS no arquivo; o padrão só vale para a criatura que chega pela
// caixa de entrada (inimigos-custom.json) sem declarar as suas. Até o B14 o padrão
// somava um degrau pelo desafio (corruptor maior mais horrendo, celestial e dragão
// maiores mais belos, Valor +1 no desafio 5 e 6); esse degrau saiu, porque o
// desafio vai ser recalibrado e não pode mudar a criatura.
export const AP_BASE = {
  Celestial: 10, Positive: 9, Fey: 8, Dragon: 8, Astral: 6, Monitor: 6, Dream: 6, Spirit: 5,
  Elemental: 5, Beast: 5, Time: 5, Animal: 4, Construct: 4, Ethereal: 4, Humanoid: 4, Petitioner: 4,
  Plant: 3, Shadow: 3, Undead: 2, Fungus: 2, Fiend: 1, Aberration: 1, Ooze: 1, Negative: 1,
};
// [Compaixão, Convicção, Temperança, Valor]
export const V_BASE = {
  Celestial: [5, 5, 4, 4], Positive: [5, 4, 3, 3], Fey: [3, 3, 2, 3], Dragon: [2, 5, 3, 5],
  Monitor: [2, 4, 3, 4], Humanoid: [2, 3, 2, 3], Giant: [1, 3, 2, 4], Spirit: [1, 3, 2, 3],
  Elemental: [1, 3, 2, 3], Beast: [1, 3, 2, 3], Animal: [1, 2, 2, 2], Construct: [0, 3, 3, 3],
  Fiend: [0, 5, 2, 4], Undead: [0, 4, 2, 3], Aberration: [0, 3, 2, 3], Plant: [0, 2, 1, 2],
  Fungus: [0, 1, 1, 2], Ooze: [0, 1, 1, 2], Negative: [0, 4, 2, 3],
};
const virtudesPadrao = (tipo) => {
  const [compaixao, conviccao, temperanca, valor] = V_BASE[tipo] || [2, 2, 2, 2];
  return { compaixao, conviccao, temperanca, valor };
};

// ------------------------------------------------------- a caixa de entrada
// O botão "copiar JSON" do editor do /bestiario entrega o formato ANTIGO, para
// colar em src/data/inimigos-custom.json. Enquanto o editor não escrever o
// formato novo, a caixa continua valendo: cada objeto dela vira uma ficha aqui,
// na leitura, com os mesmos nomes de campo do arquivo.
export function deCustom(c) {
  const eco = { tipo: c.ecologia?.tipo || 'Construct', terreno: c.ecologia?.terreno || [], clima: c.ecologia?.clima || [] };
  const pe = { ...(c.pericias || {}) };
  if (c.integridade != null && pe.integridade == null) pe.integridade = c.integridade;
  const loc = c.deslocamento?.batalha ? { terra: c.deslocamento.batalha } : undefined;
  return {
    id: c.id, nome: c.nome, nomeIngles: c.nomeIngles || null,
    categoria: c.categoria || null, papel: c.tipo || 'soldado',
    conceito: c.conceito || '', descricao: c.descricao || '', tags: c.tags || [],
    imagem: c.imagem || null, porte: c.porte || 'Médio',
    dimensoes: { medida: c.dimensoes?.medida || 'sem medida', peso: c.dimensoes?.peso || 'sem peso' },
    ...(c.material ? { material: c.material } : {}),
    ...(loc ? { locomocao: loc } : {}),
    centelha: c.centelha || 0,
    attrs: c.attrs || {}, skills: pe,
    virtues: c.virtudes || virtudesPadrao(eco.tipo),
    willpower: c.vontade ?? 5,
    aparencia: c.aparencia ?? AP_BASE[eco.tipo] ?? 4,
    ...(c.artes?.length ? { arte: Object.fromEntries(c.artes.map((a) => [a.id, a.nivel])) } : {}),
    ...(c.tecnicas?.length ? { tech: Object.fromEntries(c.tecnicas.map((t) => [t, true])) } : {}),
    ...(c.armadura && c.armadura !== 'nenhuma' ? { equip: { armaduras: [c.armadura] } } : {}),
    ataques: c.ataques || [],
    ...(c.bonus ? { bonus: c.bonus } : {}),
    ...(c.poderes?.length ? { poderes: c.poderes } : {}),
    ...(c.fraquezas ? { fraquezas: c.fraquezas } : {}),
    ...(c.resistencias ? { resistencias: c.resistencias } : {}),
    habilidades: c.habilidades || [], lore: c.lore || [], ecologia: eco,
    notas: c.notas || '', pendente: c.pendente ?? false,
    variantes: [], ameacaLegada: c.ameaca ?? 1,
    ...(c.deslocamento ? { deslocamentoDeclarado: c.deslocamento } : {}),
  };
}

// ------------------------------------------------------------- a leitura
/** As fichas da pasta, na ordem do inimigos.json (`ordem`, depois id), e em
 *  seguida as da caixa de entrada. Id repetido para o gerador. */
export function lerCriaturas() {
  const da = fs.readdirSync(PASTA).filter((f) => f.endsWith('.json')).map((f) => {
    const c = JSON.parse(fs.readFileSync(path.join(PASTA, f), 'utf8'));
    if (`${c.id}.json` !== f) throw new Error(`bestiario/${f}: o id "${c.id}" não bate com o nome do arquivo`);
    return c;
  });
  da.sort((a, b) => (a.ordem ?? Infinity) - (b.ordem ?? Infinity) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const f = path.join(ROOT, 'src/data/inimigos-custom.json');
  const caixa = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).filter((c) => c && c.id).map(deCustom) : [];
  const vistos = new Set();
  for (const c of [...da, ...caixa]) {
    if (vistos.has(c.id)) throw new Error(`o id "${c.id}" aparece duas vezes no bestiário (pasta ou inimigos-custom.json)`);
    vistos.add(c.id);
  }
  return [...da, ...caixa];
}

/** A ficha → o objeto que o `stat()` recebe. */
export function paraStat(f) {
  const pericias = { ...(f.skills || {}), ...(f.skills2 || {}) };
  const arm = f.equip?.armaduras?.[0];
  return {
    id: f.id, nome: f.nome, tipo: f.papel,
    categoria: f.categoriaLegada ?? f.categoria ?? undefined,
    ameaca: f.ameacaLegada, centelha: f.centelha,
    conceito: f.conceito, descricao: f.descricaoLegada ?? f.descricao, tags: f.tags,
    attrs: f.attrs, pericias, vontade: f.willpower,
    ...(f.spec && Object.keys(f.spec).length ? { especialidades: f.spec } : {}),
    armadura: arm ? (typeof arm === 'string' ? arm : arm.base) : 'nenhuma',
    ataques: f.ataques,
    tecnicas: Object.keys(f.tech || {}).filter((k) => f.tech[k]),
    artes: Object.entries(f.arte || {}).map(([id, nivel]) => ({ id, nivel })),
    ...(f.poderes ? { poderes: f.poderes } : {}),
    ...(f.bonus ? { bonus: f.bonus } : {}),
    ...(f.couraca ? { couraca: f.couraca } : {}),
    notas: f.notas, pendente: f.pendente,
    porteSlug: porteSlug(f.porte),
  };
}
