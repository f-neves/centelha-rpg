// gen-bestiario.mjs — gera src/data/inimigos.json com stat blocks CONSISTENTES
// (PV/Defesa/Soak/Iniciativa/pools de ataque calculados pelas fórmulas de regras.json).
// uso: node scripts/gen-bestiario.mjs   |   depois o JSON é a fonte editável.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = regras.derivados;
const fl = Math.floor, ce = Math.ceil;
const ARMAD = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armaduras.json'), 'utf8')).map((a) => [a.id, a]));
const SOAKCATS = ['impacto', 'corte', 'perfuracao'];
const cNoSoak = regras.dano?.centelhaNoSoak ?? 0;
// Soak natural por modo: Impacto = Vigor cheio; letais = metade do Vigor.
const soakNat = (vigor, modo) => (modo === 'impacto' ? vigor : fl(vigor / 2));

// build compacta → stat block calculado
function stat(b) {
  const at = { forca: 2, destreza: 2, vigor: 2, influencia: 2, perspicacia: 2, compostura: 2, percepcao: 2, inteligencia: 2, raciocinio: 2, ...b.attrs };
  const pe = b.pericias || {};
  const arm = ARMAD[b.armadura || 'nenhuma'] || ARMAD['nenhuma'];
  const C = b.centelha || 0;
  const pv = D.pv.base + at.vigor * D.pv.vigorMult;
  const espEsq = (b.especialidades && b.especialidades.esquiva) || 0;
  const defesa = (at.destreza + (pe.esquiva || 0)) * D.defesa.mult + espEsq + C * (D.defesa.centelhaMult ?? 1) - (arm.penalidade || 0);
  const integ = pe.integridade ?? b.integridade ?? 2;
  const defesaMental = integ * D.defesaMental.mult + (D.defesaMental.maisVontade ? (b.vontade ?? 5) : 0) + (D.defesaMental.maisCentelha ? C * (D.defesaMental.centelhaMult ?? 1) : 0);
  const ini = at.raciocinio + (pe.prontidao || 0);
  const ataques = (b.ataques || []).map((a) => {
    const soma = (at[a.atrib] || 0) + (pe[a.pericia] || 0);
    const dados = fl(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const acerto = (a.acerto || 0) + C * (D.ataque?.centelhaMult ?? 0);
    const pool = `${dados}d6${bonus ? '+2' : ''}${acerto ? ` +${acerto}` : ''}`;
    const fm = D.danoForca; const forcaAp = a.mao === 2 ? at.forca * fm.duasMaos : at.forca * fm.umaMao;
    const fa = a.distancia ? 0 : forcaAp;
    const perf = a.perf ?? a.pen;
    const dano = `${a.dado}d6${fa ? ` +${fa}` : ''} ${a.tipo}${perf != null ? ` · perf. ${perf}` : ''}`;
    return { nome: a.nome, pool, dano, ticks: a.ticks, ...(a.notas ? { notas: a.notas } : {}) };
  });
  const soak = Object.fromEntries(SOAKCATS.map((m) => [m, soakNat(at.vigor, m) + C * cNoSoak + (arm.soak?.[m] ?? 0)]));
  const out = {
    id: b.id, nome: b.nome, tipo: b.tipo,
    categoria: b.categoria || catFromTags(b.tags || []),
    ameaca: b.ameaca, centelha: C,
    conceito: b.conceito, descricao: b.descricao, tags: b.tags || [],
    pv, defesa, defesaMental,
    soak, resistPerf: arm.resistPerf ?? 0,
    iniciativa: `1d6 + ${ini}`,
    atributos: at, ataques,
    tecnicas: b.tecnicas || [], artes: b.artes || [],
    notas: b.notas || '', pendente: b.pendente ?? false,
  };
  if (b.poderes && b.poderes.length) out.poderes = b.poderes;
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

const NPCS = [
  { id: 'camponis-assustado', nome: 'Camponês Assustado', tipo: 'capanga', ameaca: 1, centelha: 0,
    conceito: 'civil sem treino', descricao: 'Gente comum empurrada à briga. Foge ao primeiro sangue.', tags: ['humano'],
    attrs: { forca: 2, destreza: 2, vigor: 2 }, pericias: { briga: 1, esquiva: 0, prontidao: 1 }, integridade: 4, vontade: 4,
    ataques: [{ nome: 'Forcado/Pancada', atrib: 'forca', pericia: 'briga', dado: 1, mao: 2, tipo: 'impacto', ticks: 5 }],
    notas: 'Testa de ferro frágil. Em grupo, use a regra de Horda.' },

  { id: 'bandido-de-estrada', nome: 'Bandido de Estrada', tipo: 'capanga', ameaca: 2, centelha: 0,
    conceito: 'salteador oportunista', descricao: 'Ataca em bando, recua se a luta vira.', tags: ['humano'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-uma-mao': 2, esquiva: 2, prontidao: 2, furtividade: 2 }, integridade: 4, vontade: 5,
    armadura: 'couro',
    ataques: [{ nome: 'Facão', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 1, mao: 1, tipo: 'corte', acerto: 2, ticks: 5 }],
    notas: 'Couro leve (Soak +2). Tenta emboscar.' },

  { id: 'guarda-da-cidade', nome: 'Guarda da Cidade', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'milícia treinada', descricao: 'Patrulha disciplinada, luta em formação com escudo.', tags: ['humano'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-uma-mao': 3, esquiva: 2, escudos: 2, prontidao: 3 }, integridade: 5, vontade: 5,
    armadura: 'malha',
    ataques: [{ nome: 'Espada curta', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 1, mao: 1, tipo: 'corte', acerto: 2, ticks: 5 }],
    notas: 'Malha (Soak +4, Esquiva −1) + escudo (+2 ao Bloqueio). Chama reforço.' },

  { id: 'soldado-veterano', nome: 'Soldado Veterano', tipo: 'soldado', ameaca: 3, centelha: 0,
    conceito: 'lâmina experiente', descricao: 'Anos de guerra; lê o combate e explora aberturas.', tags: ['humano'],
    attrs: { forca: 3, destreza: 4, vigor: 3 }, pericias: { 'armas-uma-mao': 4, esquiva: 3, escudos: 2, prontidao: 3, tatica: 2 }, integridade: 5, vontade: 6,
    armadura: 'malha',
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    notas: 'Aproveita Quase Acerto e foca alvos isolados.' },

  { id: 'arqueiro', nome: 'Arqueiro', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'fogo à distância', descricao: 'Domina o campo antes do contato; recua se cercado.', tags: ['humano'],
    attrs: { forca: 2, destreza: 4, vigor: 2, percepcao: 3 }, pericias: { 'atirador': 4, esquiva: 2, prontidao: 3 }, integridade: 4, vontade: 5,
    armadura: 'couro',
    ataques: [{ nome: 'Arco', atrib: 'destreza', pericia: 'atirador', dado: 2, distancia: true, tipo: 'projetil', acerto: 1, perf: 1, ticks: 6 }],
    notas: 'Projétil perf. 1: fura couro e malha, mas resvala na placa (Resist. 2). Mira (+2) quando pode.' },

  { id: 'bruto', nome: 'Bruto', tipo: 'soldado', ameaca: 3, centelha: 0,
    conceito: 'músculo pesado', descricao: 'Lento, mas cada golpe derruba. Mira em quebrar a guarda.', tags: ['humano'],
    attrs: { forca: 5, destreza: 2, vigor: 4 }, pericias: { 'armas-duas-maos': 3, esquiva: 1, resistencia: 3 }, integridade: 4, vontade: 5,
    armadura: 'couro',
    ataques: [{ nome: 'Martelo de guerra', atrib: 'forca', pericia: 'armas-duas-maos', dado: 3, mao: 2, tipo: 'impacto', acerto: 0, ticks: 7, notas: 'Impacto: a armadura quase não absorve (anti-placa)' }],
    notas: 'Speed 7 (age pouco). Cerque-o e explore a lentidão.' },

  { id: 'capitao-da-guarda', nome: 'Capitão da Guarda', tipo: 'elite', ameaca: 4, centelha: 0,
    conceito: 'comandante mortal', descricao: 'Líder competente; coordena subordinados e segura a linha.', tags: ['humano'],
    attrs: { forca: 3, destreza: 4, vigor: 4, influencia: 3 }, pericias: { 'armas-uma-mao': 4, esquiva: 3, escudos: 3, prontidao: 4, oratoria: 3, tatica: 3 }, integridade: 6, vontade: 7,
    armadura: 'placa-completa',
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    notas: 'Placa (Soak +6, Esquiva −2, lento) + escudo. Pico do que um mortal alcança.' },

  { id: 'assassino-das-sombras', nome: 'Assassino das Sombras', tipo: 'elite', ameaca: 4, centelha: 2,
    conceito: 'lâmina silenciosa', descricao: 'Surge das sombras, aplica um golpe e some.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 5, vigor: 3, percepcao: 4 }, pericias: { 'armas-uma-mao': 4, furtividade: 5, esquiva: 4, prontidao: 4, manha: 3 }, integridade: 4, vontade: 6,
    armadura: 'couro',
    ataques: [{ nome: 'Adaga (Ágil)', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 1, mao: 1, tipo: 'perfConc', acerto: 2, perf: 0, ticks: 5, notas: 'Ágil: usa Destreza no dano. Perf. 0: contra armadura, mira na fresta ou no alvo desprevenido' }],
    tecnicas: ['pisar-leve', 'esgueirar', 'bote-silencioso', 'manto-de-sombras'],
    notas: 'Bote Silencioso: +2d6 de dano contra alvo desavisado (que já sofre a penalidade de Defesa por surpresa).' },

  { id: 'duelista', nome: 'Duelista', tipo: 'elite', ameaca: 4, centelha: 2,
    conceito: 'esgrimista exímio', descricao: 'Vive do duelo: apara, finta e responde com a ripose.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 5, vigor: 3 }, pericias: { 'armas-uma-mao': 5, esquiva: 4, prontidao: 4 }, integridade: 5, vontade: 6,
    armadura: 'couro',
    ataques: [{ nome: 'Florete (Ágil)', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 1, mao: 1, tipo: 'perfConc', acerto: 2, perf: 1, ticks: 5 }],
    tecnicas: ['postura-fluida', 'aparar', 'finta', 'riposte'],
    notas: 'Aparar: +3 na Defesa; Riposte contra-ataca ao aparar.' },

  { id: 'feiticeiro-menor', nome: 'Feiticeiro Menor', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'conjurador iniciante', descricao: 'Frágil no corpo a corpo, perigoso à distância com fogo.', tags: ['humano', 'centelha', 'arcano'],
    attrs: { forca: 2, destreza: 3, vigor: 2, inteligencia: 4 }, pericias: { ocultismo: 3, esquiva: 2, prontidao: 2 }, integridade: 5, vontade: 6,
    ataques: [{ nome: 'Dardo flamejante (Fogo 1)', atrib: 'inteligencia', pericia: 'ocultismo', dado: 1, distancia: true, tipo: 'fogo', ticks: 6, notas: 'Custa 1 Mana; resistido por Soak/Esquiva' }],
    artes: [{ id: 'fogo', nivel: 2 }],
    notas: 'Mana = Centelha×2 + Vontade = 8. Nível 2 (Labareda, 2d6) custa 2 Mana.' },

  { id: 'cavaleiro-de-elite', nome: 'Cavaleiro de Elite', tipo: 'elite', ameaca: 5, centelha: 1,
    conceito: 'tanque tocado pela Centelha', descricao: 'Muralha de aço e pele de pedra; aguenta o que poucos aguentam.', tags: ['humano', 'centelha'],
    attrs: { forca: 4, destreza: 3, vigor: 5 }, pericias: { 'armas-duas-maos': 4, esquiva: 3, escudos: 3, resistencia: 4, prontidao: 3 }, integridade: 6, vontade: 7,
    armadura: 'placa-completa',
    ataques: [{ nome: 'Montante', atrib: 'forca', pericia: 'armas-duas-maos', dado: 3, mao: 2, tipo: 'corte', acerto: 0, ticks: 7 }],
    tecnicas: ['pele-curtida', 'aguentar-o-tranco', 'tensionar'],
    notas: 'Placa + Pele de Pedra: Soak altíssimo contra corte. Vença-o com Impacto (a placa quase não absorve), perfuração nível 2+ ou Proeza.' },

  { id: 'campeao', nome: 'Campeão (semideus menor)', tipo: 'chefe', ameaca: 6, centelha: 2,
    conceito: 'herói inimigo', descricao: 'Um adversário à altura dos PJs: rápido, forte e com Técnicas de herói.', tags: ['humano', 'centelha'],
    attrs: { forca: 4, destreza: 5, vigor: 4, influencia: 4 }, pericias: { 'armas-uma-mao': 5, esquiva: 4, escudos: 3, prontidao: 5, intimidacao: 4, oratoria: 3 }, integridade: 6, vontade: 8,
    armadura: 'malha',
    ataques: [{ nome: 'Espada longa (golpe duplo)', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6, notas: 'Pode dividir em 2 ataques (−1d6/−2d6)' }],
    tecnicas: ['golpe-pesado', 'quebrar-guarda', 'soco-trovejante'],
    notas: 'Energia ≈ Centelha×3 + Virtudes + Vontade. Reservar para Técnicas de banda 1–2.' },

  { id: 'lobo', nome: 'Lobo', tipo: 'fera', ameaca: 2, centelha: 0,
    conceito: 'predador de matilha', descricao: 'Rápido e implacável em grupo; ataca os flancos.', tags: ['fera'],
    attrs: { forca: 3, destreza: 4, vigor: 3, percepcao: 4 }, pericias: { briga: 3, esquiva: 3, prontidao: 4, furtividade: 3 }, integridade: 3, vontade: 4,
    ataques: [{ nome: 'Mordida', atrib: 'forca', pericia: 'briga', dado: 1, mao: 2, tipo: 'perfConc', acerto: 1, perf: 1, ticks: 5, notas: 'Em matilha: ataca pelo flanco (−2 na Defesa do alvo)' }],
    notas: 'Anda em matilha (3–6). Dois ou mais coordenados somam Flanco (−2 Defesa) e Pressão; use Horda para grandes alcateias.' },

  { id: 'urso', nome: 'Urso', tipo: 'fera', ameaca: 4, centelha: 0,
    conceito: 'fera colossal', descricao: 'Força esmagadora e couro grosso; um perigo sério sozinho.', tags: ['fera'],
    attrs: { forca: 5, destreza: 2, vigor: 5, percepcao: 3 }, pericias: { briga: 3, resistencia: 4, prontidao: 3 }, integridade: 3, vontade: 5,
    armadura: 'nenhuma',
    ataques: [{ nome: 'Garras', atrib: 'forca', pericia: 'briga', dado: 2, mao: 2, tipo: 'corte', acerto: 1, ticks: 6, notas: 'Dilacerantes: golpe com Margem abre Sangramento (= Margem, máx 3); pode agarrar' }],
    notas: 'Couro grosso (Soak natural alto pelo Vigor 5). Defesa baixa, mas aguenta — e as garras sangram. Difícil de derrubar.' },

  { id: 'comandante', nome: 'Comandante Tocado', tipo: 'elite', ameaca: 5, centelha: 1,
    conceito: 'líder de guerra', descricao: 'Inspira tropas e quebra a moral inimiga; luta bem, mas comanda melhor.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 4, vigor: 4, influencia: 5 }, pericias: { 'armas-uma-mao': 4, esquiva: 3, escudos: 3, oratoria: 4, tatica: 4, intimidacao: 4, prontidao: 3 }, integridade: 6, vontade: 7,
    armadura: 'placa-completa',
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    tecnicas: ['voz-de-lider', 'coordenar', 'tom-de-autoridade'],
    notas: 'Concede ações e bônus aos aliados (Estandarte/Comando). Some Influência quando inspira. Mate-o e a tropa vacila.' },

  { id: 'cultista', nome: 'Cultista Sombrio', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'feiticeiro da morte', descricao: 'Servo de poderes proibidos; drena a vida e ergue os mortos.', tags: ['humano', 'centelha', 'arcano'],
    attrs: { forca: 2, destreza: 3, vigor: 3, influencia: 4, inteligencia: 3 }, pericias: { ocultismo: 4, esquiva: 2, prontidao: 2, manha: 3 }, integridade: 3, vontade: 7,
    ataques: [{ nome: 'Toque mórbido (Morte 1)', atrib: 'inteligencia', pericia: 'ocultismo', dado: 1, distancia: true, tipo: 'necrótico', ticks: 6, notas: 'Dreno: cura o cultista' }],
    artes: [{ id: 'morte', nivel: 2 }],
    notas: 'Mana 9. Em ritual, ergue um morto-vivo (Morte nível 3). Frágil no corpo a corpo.' },

  { id: 'esqueleto', nome: 'Esqueleto Guerreiro', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'morto-vivo', descricao: 'Ossos animados que não sentem dor nem medo; lutam até despedaçar.', tags: ['morto-vivo'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-uma-mao': 2, esquiva: 2, escudos: 1 }, integridade: 5, vontade: 5,
    armadura: 'couro',
    ataques: [{ nome: 'Espada enferrujada', atrib: 'destreza', pericia: 'armas-uma-mao', dado: 1, mao: 1, tipo: 'corte', acerto: 1, ticks: 5 }],
    notas: 'Morto-vivo: imune a medo, veneno e efeitos mentais. Dano de Impacto (esmagar ossos) é especialmente eficaz.' },

  { id: 'espectro', nome: 'Espectro', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'assombração incorpórea', descricao: 'Um morto que não partiu; atravessa paredes e gela a alma.', tags: ['morto-vivo', 'espírito'],
    attrs: { forca: 2, destreza: 4, vigor: 3, influencia: 4, percepcao: 4 }, pericias: { esquiva: 4, intimidacao: 4, furtividade: 5, prontidao: 4 }, integridade: 4, vontade: 8,
    ataques: [{ nome: 'Toque gélido', atrib: 'influencia', pericia: 'briga', dado: 2, mao: 2, tipo: 'necrótico (vs Def. Mental)', ticks: 5, notas: 'gela a vontade do alvo' }],
    notas: 'Incorpóreo: imune a dano físico não-mágico e atravessa matéria. Só Arcano, Proteção e armas encantadas o ferem.' },

  { id: 'ogro', nome: 'Ogro', tipo: 'chefe', ameaca: 5, centelha: 0,
    conceito: 'brutamontes monstruoso', descricao: 'Montanha de músculo e fúria; cada golpe é um aríete.', tags: ['fera', 'gigante'],
    attrs: { forca: 6, destreza: 2, vigor: 6 }, pericias: { briga: 3, 'armas-duas-maos': 3, resistencia: 4, intimidacao: 3 }, integridade: 3, vontade: 5,
    armadura: 'nenhuma',
    ataques: [{ nome: 'Clava enorme', atrib: 'forca', pericia: 'armas-duas-maos', dado: 3, mao: 2, tipo: 'impacto', acerto: 0, ticks: 7, notas: 'Impacto; derruba o alvo' }],
    notas: 'Força e Vigor 6 (acima do humano). Lento (Speed 7) e de Defesa baixa: cerque e explore a lentidão.' },

  { id: 'aranha-gigante', nome: 'Aranha Gigante', tipo: 'fera', ameaca: 3, centelha: 0,
    conceito: 'predadora venenosa', descricao: 'Emboscadora de patas longas; uma picada e a presa amolece.', tags: ['fera'],
    attrs: { forca: 3, destreza: 4, vigor: 3, percepcao: 4 }, pericias: { briga: 3, furtividade: 4, esquiva: 3, prontidao: 4 }, integridade: 2, vontade: 4,
    ataques: [{ nome: 'Picada peçonhenta', atrib: 'destreza', pericia: 'briga', dado: 1, mao: 2, tipo: 'perfConc', acerto: 1, perf: 1, ticks: 5, notas: 'Veneno (efeito de Corpo): resista com Vigor + Convicção ou sofra −2 em ações por uma cena' }],
    notas: 'Sobe paredes, ataca das sombras e prende a presa em teia.' },

  { id: 'mago-de-batalha', nome: 'Mago de Batalha', tipo: 'chefe', ameaca: 6, centelha: 2,
    conceito: 'artilharia arcana', descricao: 'Conjura fogo e força sobre o campo; perigoso a qualquer distância.', tags: ['humano', 'centelha', 'arcano'],
    attrs: { forca: 2, destreza: 3, vigor: 3, inteligencia: 5 }, pericias: { ocultismo: 5, esquiva: 3, prontidao: 3, conhecimentos: 3 }, integridade: 5, vontade: 8,
    ataques: [{ nome: 'Bola de fogo (Fogo 3)', atrib: 'inteligencia', pericia: 'ocultismo', dado: 3, distancia: true, tipo: 'fogo (área)', ticks: 6, notas: '3 Mana; explosão em área' }],
    artes: [{ id: 'fogo', nivel: 3 }, { id: 'forcas', nivel: 2 }],
    notas: 'Mana 12. Escudo de Força (Forças) o protege; Bola de Fogo atinge grupos. Feche a distância e quebre a concentração.' },
];

// ===================================================================
// Criaturas convertidas de D&D 3.5 / Pathfinder.
// Fonte ÚNICA: conversao-monstros.html (DATA = scores crus; PODERES = poderes mapeados).
// A conversão de Habilidades→Atributos e a curva vivem no HTML; aqui só reusamos.
// ===================================================================
const catalogos = {
  caminhos: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/caminhos.json'), 'utf8')),
  tecnicas: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tecnicas.json'), 'utf8')),
  artes: JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/artes.json'), 'utf8')),
};
// nome de Caminho → id (mais longos primeiro p/ "Máscara Impassível" ganhar de "Máscara")
const CAM = catalogos.caminhos.map((c) => ({ id: c.id, nome: c.nome })).sort((a, b) => b.nome.length - a.nome.length);
const TEC = catalogos.tecnicas.map((t) => ({ id: t.id, nome: t.nome, caminho: t.caminho?.id ?? t.caminho, banda: t.banda }));
const ARTE_NOME2ID = Object.fromEntries(catalogos.artes.map((a) => [a.nome, a.id]));
const ARTE_LIST = catalogos.artes.map((a) => a.nome).join('|');

// motor de conversão (espelha o do HTML)
function attr(s) {
  if (s === null || s === undefined || s === '-') return null;
  s = +s;
  if (s <= 1) return 0; if (s <= 7) return 1; if (s <= 11) return 2; if (s <= 13) return 3;
  if (s <= 15) return 4; if (s <= 19) return 5; if (s <= 21) return 6; if (s <= 24) return 7;
  if (s <= 27) return 8; if (s <= 31) return 9; if (s <= 35) return 10; if (s <= 40) return 11;
  if (s <= 45) return 12; return 12 + Math.floor((s - 45) / 6);
}
const SIZEBON = { medio: 0, pequeno: 0, minusculo: 0, grande: 1, enorme: 2, imenso: 3, colossal: 4 };
const avg2 = (a, b) => { const A = (a === '-' || a == null), B = (b === '-' || b == null); if (A && B) return null; if (A) return +b; if (B) return +a; return Math.round((+a + +b) / 2); };
function converte(m) {
  const sz = SIZEBON[m.size] || 0;
  const vig = (m.con === '-' || m.con == null) ? m.cha : m.con;
  return {
    forca: (m.str === '-' || m.str == null) ? 0 : (attr(m.str) + sz),
    destreza: attr(m.dex),
    vigor: (vig === '-' || vig == null) ? 1 : (attr(vig) + sz),
    influencia: attr(m.cha), perspicacia: attr(avg2(m.int, m.cha)), compostura: attr(avg2(m.wis, m.cha)),
    percepcao: attr(m.wis), inteligencia: (m.int === '-' || m.int == null) ? 0 : attr(m.int), raciocinio: attr(avg2(m.wis, m.int)),
  };
}

// extrai DATA e PODERES do HTML (mesma técnica das validações)
const html = fs.readFileSync(path.join(ROOT, 'conversao-monstros.html'), 'utf8');
function evalBlock(marker, close) {
  const s = html.indexOf(marker); if (s < 0) throw new Error(`bloco não achado: ${marker}`);
  const e = html.indexOf(close, s); if (e < 0) throw new Error(`fim do bloco não achado: ${close}`);
  return html.slice(s + marker.length, e + close.length);
}
let DATA, PODERES;
eval('DATA=' + evalBlock('const DATA = ', '];'));
eval('PODERES=' + evalBlock('const PODERES = ', '\n};'));

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const crNum = (cr) => { const s = String(cr); if (s.includes('/')) { const [a, b] = s.split('/'); return +a / +b; } return +s; };
const ameacaDe = (cr) => { const n = crNum(cr); return n < 1 ? 1 : n < 3 ? 2 : n < 5 ? 3 : n < 8 ? 4 : n < 14 ? 5 : 6; };
function categoriaDe(t) {
  t = t.toLowerCase();
  if (t.includes('dragão')) return 'Dragão';
  if (t.includes('(demônio)')) return 'Demônio';
  if (t.includes('(diabo)')) return 'Diabo';
  if (t.includes('(anjo)') || t.includes('(celestial)')) return 'Celestial';
  if (t.includes('(ar)') || t.includes('(fogo)') || t.includes('(terra)') || t.includes('(água)')) return 'Elemental';
  if (t.includes('exterior')) return 'Exterior';
  if (t.includes('morto-vivo')) return 'Morto-vivo';
  if (t.includes('fada')) return 'Fada';
  if (t.includes('planta')) return 'Planta';
  if (t.includes('limo')) return 'Limo';
  if (t.includes('humanoide monstruoso')) return 'Monstro';
  if (t.includes('aberração')) return 'Aberração';
  if (t.includes('gigante')) return 'Gigante';
  if (t.includes('humanoide')) return 'Humanoide';
  if (t.includes('besta mágica')) return 'Besta mágica';
  if (t.includes('animal') || t.includes('praga')) return 'Fera';
  return 'Monstro';
}
const CAT_DESC = {
  'Dragão': 'Predador alado e mágico, orgulho e ganância feitos carne.',
  'Demônio': 'Horror caótico do Abismo, feito de fúria e corrupção.',
  'Diabo': 'Tirano leal do Inferno, calculista e cruel.',
  'Celestial': 'Servo do bem, luz encarnada em guerra contra as trevas.',
  'Elemental': 'Ser de um único elemento, sem alma mortal.',
  'Exterior': 'Nativo de outro plano, alheio às leis mortais.',
  'Morto-vivo': 'Um morto que não descansa, movido por magia ou ódio.',
  'Fada': 'Espírito da natureza, belo e caprichoso.',
  'Planta': 'Vegetal desperto, lento e implacável.',
  'Limo': 'Massa informe que digere tudo que toca.',
  'Monstro': 'Aberração humanoide de lendas antigas.',
  'Aberração': 'Coisa de forma errada, de pesadelos e profundezas.',
  'Gigante': 'Colosso humanoide, força bruta em escala descomunal.',
  'Humanoide': 'Povo civilizado ou selvagem, do tamanho de um homem.',
  'Besta mágica': 'Fera tocada pela magia, além do reino natural.',
  'Fera': 'Animal selvagem, perigo puro sem malícia.',
};
function tipoDe(cat, ameaca) {
  if (['Fera', 'Besta mágica'].includes(cat) && ameaca <= 4) return 'fera';
  if (ameaca >= 5) return 'chefe';
  if (ameaca === 4) return 'elite';
  if (ameaca <= 1) return 'capanga';
  return 'soldado';
}
function ataqueDe(m, at, cat, ameaca) {
  if (/incorpóreo/.test(m.type)) {
    return { nome: 'Toque dilacerante', atrib: 'influencia', pericia: 'briga', dado: 2, mao: 2, tipo: 'necrótico (vs Def. Mental)', ticks: 5, notas: 'atravessa matéria; só Arcano, Proteção ou arma encantada o ferem' };
  }
  const dado = ({ minusculo: 1, pequeno: 1, medio: 1, grande: 2, enorme: 3, imenso: 3, colossal: 4 })[m.size] || 1;
  let nome = 'Ataque natural', tipo = 'perfConc';
  if (cat === 'Gigante') { nome = 'Pancada descomunal'; tipo = 'impacto'; }
  else if (cat === 'Humanoide' || cat === 'Monstro') { nome = 'Arma'; tipo = 'corte'; }
  else if (cat === 'Morto-vivo') { nome = 'Golpe'; tipo = 'impacto'; }
  else if (cat === 'Limo') { nome = 'Pseudópode'; tipo = 'impacto'; }
  else if (cat === 'Dragão') { nome = 'Garras e mordida'; tipo = 'perfConc'; }
  else if (['Demônio', 'Diabo', 'Celestial', 'Exterior', 'Elemental'].includes(cat)) { nome = 'Golpe planar'; tipo = 'corte'; }
  else { nome = 'Garras e presas'; tipo = 'perfConc'; }
  const ticks = dado >= 3 ? 7 : dado === 2 ? 6 : 5;
  return { nome, atrib: 'forca', pericia: 'briga', dado, mao: 2, tipo, acerto: 0, ticks };
}
function poderesDe(name, centelha) {
  const list = PODERES[name] || [];
  const poderes = []; const tecSet = new Set(); const arteMap = {};
  for (const [efeito, k, alvo] of list) {
    const tipo = k === 'p' ? 'proeza' : k === 'a' ? 'feiticaria' : 'natural';
    const pod = { efeito, tipo, alvo };
    if (k === 'a') {
      const pairs = [...alvo.matchAll(new RegExp(`(${ARTE_LIST})\\s*·\\s*N(\\d)`, 'g'))];
      if (pairs.length) {
        pod.arte = ARTE_NOME2ID[pairs[0][1]];
        for (const [, an, nv] of pairs) { const id = ARTE_NOME2ID[an]; const n = Math.min(+nv, centelha || 5, 5); if (centelha >= 1) arteMap[id] = Math.max(arteMap[id] || 0, n); }
      }
    } else if (k === 'p') {
      const cam = CAM.find((c) => alvo.includes(c.nome));
      if (cam) {
        pod.caminho = cam.id;
        for (const t of TEC) { if (t.caminho === cam.id && alvo.includes(t.nome) && Math.ceil(t.banda / 3) <= (centelha || 0)) tecSet.add(t.id); }
      }
    }
    poderes.push(pod);
  }
  return { poderes, tecnicas: [...tecSet], artes: Object.entries(arteMap).map(([id, nivel]) => ({ id, nivel })) };
}

const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const CONV = DATA.map((m) => {
  const at = converte(m);
  const cat = categoriaDe(m.type);
  const ameaca = ameacaDe(m.cr);
  const { poderes, tecnicas, artes } = poderesDe(m.name, m.cent);
  const tags = [...new Set([slug(cat), ...(m.cent > 0 ? ['centelha'] : []), ...(/incorpóreo/.test(m.type) ? ['incorpóreo'] : []), ...(artes.length ? ['mágico'] : [])])];
  const briga = cl(ameaca + (m.cent > 0 ? 1 : 0), 1, 5);
  const notasPart = [];
  if (m.sk && m.sk.length) notasPart.push(`Perícias notáveis: ${m.sk.join(', ')}.`);
  if (m.cent > 5) notasPart.push('Centelha acima do teto mortal (entidade).');
  return stat({
    id: 'mon-' + slug(m.name),
    nome: m.name, tipo: tipoDe(cat, ameaca), categoria: cat, ameaca, centelha: m.cent,
    conceito: m.type, descricao: CAT_DESC[cat] || '',
    tags,
    attrs: at,
    pericias: { briga, esquiva: cl(Math.floor(at.destreza / 3), 0, 4), prontidao: cl(Math.floor(at.percepcao / 2), 0, 5), integridade: cl(at.compostura, 2, 8) },
    integridade: cl(at.compostura, 2, 8), vontade: cl(5 + m.cent, 5, 12),
    armadura: 'nenhuma',
    ataques: [ataqueDe(m, at, cat, ameaca)],
    tecnicas, artes, poderes,
    notas: notasPart.join(' '),
    pendente: true,
  });
});

const inimigos = [...NPCS.map(stat), ...CONV];
fs.writeFileSync(path.join(ROOT, 'src/data/inimigos.json'), JSON.stringify(inimigos, null, 2) + '\n', 'utf8');
const byCat = {};
for (const n of inimigos) byCat[n.categoria] = (byCat[n.categoria] || 0) + 1;
console.log(`inimigos.json: ${inimigos.length} entradas (${NPCS.length} feitos à mão + ${CONV.length} convertidos).`);
console.log('Por categoria:', JSON.stringify(byCat));
const semPoder = CONV.filter((c) => !c.poderes || !c.poderes.length).length;
console.log(`Convertidos sem poderes mapeados: ${semPoder}.`);
