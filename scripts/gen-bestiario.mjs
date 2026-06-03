// gen-bestiario.mjs — gera src/data/inimigos.json com stat blocks CONSISTENTES
// (PV/Defesa/Soak/Iniciativa/pools de ataque calculados pelas fórmulas de regras.json).
// uso: node scripts/gen-bestiario.mjs   |   depois o JSON é a fonte editável.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = regras.derivados;
const fl = Math.floor, ce = Math.ceil;

// build compacta → stat block calculado
function stat(b) {
  const at = { forca: 2, destreza: 2, vigor: 2, carisma: 2, manipulacao: 2, aparencia: 2, percepcao: 2, inteligencia: 2, raciocinio: 2, ...b.attrs };
  const pe = b.pericias || {};
  const arm = { soak: 0, prot: 0, esquiva: 0, ...b.armadura };
  const C = b.centelha || 0;
  const pv = D.pv.base + at.vigor * D.pv.vigorMult;
  const somaEsq = at.destreza + (pe.esquiva || 0);
  const defesa = somaEsq * D.defesa.mult - fl(somaEsq / D.defesa.somaDiv) + ce(C / D.defesa.centelhaCeilDiv) + (arm.esquiva || 0);
  const defesaMental = fl(((b.integridade ?? 4) + (b.vontade ?? 5)) / D.defesaMental.div) + C;
  const ini = at.raciocinio + (pe.prontidao || 0);
  const ataques = (b.ataques || []).map((a) => {
    const soma = (at[a.atrib] || 0) + (pe[a.pericia] || 0);
    const dados = fl(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const acerto = a.acerto || 0;
    const pool = `${dados}d6${bonus ? '+2' : ''}${acerto ? ` +${acerto}` : ''}`;
    const forcaAp = a.mao === 2 ? at.forca : fl(at.forca / 2);
    const fa = a.distancia ? 0 : forcaAp;
    const dano = `${a.dado}d6${fa ? ` +${fa}` : ''} ${a.tipo}${a.pen ? ` · Pen ${a.pen}` : ''}`;
    return { nome: a.nome, pool, dano, ticks: a.ticks, ...(a.notas ? { notas: a.notas } : {}) };
  });
  return {
    id: b.id, nome: b.nome, tipo: b.tipo, ameaca: b.ameaca, centelha: C,
    conceito: b.conceito, descricao: b.descricao, tags: b.tags || [],
    pv, defesa, defesaMental,
    soak: { impacto: at.vigor + arm.soak, letal: fl(at.vigor / 2) + arm.soak, protecao: arm.prot },
    iniciativa: `1d6 + ${ini}`,
    atributos: at, ataques,
    tecnicas: b.tecnicas || [], artes: b.artes || [],
    notas: b.notas || '', pendente: true,
  };
}

const NPCS = [
  { id: 'camponis-assustado', nome: 'Camponês Assustado', tipo: 'capanga', ameaca: 1, centelha: 0,
    conceito: 'civil sem treino', descricao: 'Gente comum empurrada à briga. Foge ao primeiro sangue.', tags: ['humano'],
    attrs: { forca: 2, destreza: 2, vigor: 2 }, pericias: { briga: 1, esquiva: 0, prontidao: 1 }, integridade: 4, vontade: 4,
    ataques: [{ nome: 'Forcado/Pancada', atrib: 'forca', pericia: 'briga', dado: 1, mao: 2, tipo: 'impacto', ticks: 5 }],
    notas: 'Testa de ferro frágil. Em grupo, use a regra de Horda.' },

  { id: 'bandido-de-estrada', nome: 'Bandido de Estrada', tipo: 'capanga', ameaca: 2, centelha: 0,
    conceito: 'salteador oportunista', descricao: 'Ataca em bando, recua se a luta vira.', tags: ['humano'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-de-corte': 2, esquiva: 2, prontidao: 2, furtividade: 2 }, integridade: 4, vontade: 5,
    armadura: { soak: 2, prot: 1, esquiva: 0 },
    ataques: [{ nome: 'Facão', atrib: 'destreza', pericia: 'armas-de-corte', dado: 1, mao: 1, tipo: 'corte', acerto: 2, ticks: 5 }],
    notas: 'Couro leve (Soak +2). Tenta emboscar.' },

  { id: 'guarda-da-cidade', nome: 'Guarda da Cidade', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'milícia treinada', descricao: 'Patrulha disciplinada, luta em formação com escudo.', tags: ['humano'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-de-corte': 3, esquiva: 2, escudos: 2, prontidao: 3 }, integridade: 5, vontade: 5,
    armadura: { soak: 4, prot: 2, esquiva: -1 },
    ataques: [{ nome: 'Espada curta', atrib: 'destreza', pericia: 'armas-de-corte', dado: 1, mao: 1, tipo: 'corte', acerto: 2, ticks: 5 }],
    notas: 'Malha (Soak +4, Esquiva −1) + escudo (+2 ao Bloqueio). Chama reforço.' },

  { id: 'soldado-veterano', nome: 'Soldado Veterano', tipo: 'soldado', ameaca: 3, centelha: 0,
    conceito: 'lâmina experiente', descricao: 'Anos de guerra; lê o combate e explora aberturas.', tags: ['humano'],
    attrs: { forca: 3, destreza: 4, vigor: 3 }, pericias: { 'armas-de-corte': 4, esquiva: 3, escudos: 2, prontidao: 3, tatica: 2 }, integridade: 5, vontade: 6,
    armadura: { soak: 4, prot: 2, esquiva: -1 },
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-de-corte', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    notas: 'Aproveita Quase Acerto e foca alvos isolados.' },

  { id: 'arqueiro', nome: 'Arqueiro', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'fogo à distância', descricao: 'Domina o campo antes do contato; recua se cercado.', tags: ['humano'],
    attrs: { forca: 2, destreza: 4, vigor: 2, percepcao: 3 }, pericias: { 'armas-a-distancia': 4, esquiva: 2, prontidao: 3 }, integridade: 4, vontade: 5,
    armadura: { soak: 2, prot: 1, esquiva: 0 },
    ataques: [{ nome: 'Arco', atrib: 'destreza', pericia: 'armas-a-distancia', dado: 2, distancia: true, tipo: 'perfurante', acerto: 1, pen: 2, ticks: 6 }],
    notas: 'Perfurante Pen 2 (zera contra malha/placa). Mira (+2) quando pode.' },

  { id: 'bruto', nome: 'Bruto', tipo: 'soldado', ameaca: 3, centelha: 0,
    conceito: 'músculo pesado', descricao: 'Lento, mas cada golpe derruba. Mira em quebrar a guarda.', tags: ['humano'],
    attrs: { forca: 5, destreza: 2, vigor: 4 }, pericias: { 'armas-de-impacto': 3, esquiva: 1, resistencia: 3 }, integridade: 4, vontade: 5,
    armadura: { soak: 2, prot: 1, esquiva: 0 },
    ataques: [{ nome: 'Martelo de guerra', atrib: 'forca', pericia: 'armas-de-impacto', dado: 3, mao: 2, tipo: 'impacto', acerto: 0, ticks: 7, notas: 'Ruptura: ignora Soak de armadura' }],
    notas: 'Speed 7 (age pouco). Cerque-o e explore a lentidão.' },

  { id: 'capitao-da-guarda', nome: 'Capitão da Guarda', tipo: 'elite', ameaca: 4, centelha: 0,
    conceito: 'comandante mortal', descricao: 'Líder competente; coordena subordinados e segura a linha.', tags: ['humano'],
    attrs: { forca: 3, destreza: 4, vigor: 4, carisma: 3 }, pericias: { 'armas-de-corte': 4, esquiva: 3, escudos: 3, prontidao: 4, oratoria: 3, tatica: 3 }, integridade: 6, vontade: 7,
    armadura: { soak: 6, prot: 3, esquiva: -2 },
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-de-corte', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    notas: 'Placa (Soak +6, Esquiva −2, lento) + escudo. Pico do que um mortal alcança.' },

  { id: 'assassino-das-sombras', nome: 'Assassino das Sombras', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'lâmina silenciosa', descricao: 'Surge das sombras, aplica um golpe e some.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 5, vigor: 3, percepcao: 4 }, pericias: { 'armas-de-corte': 4, furtividade: 5, esquiva: 4, prontidao: 4, manha: 3 }, integridade: 4, vontade: 6,
    armadura: { soak: 2, prot: 1, esquiva: 0 },
    ataques: [{ nome: 'Adaga (Ágil, Perf. 2)', atrib: 'destreza', pericia: 'armas-de-corte', dado: 1, mao: 1, tipo: 'perfurante', acerto: 2, pen: 2, ticks: 5, notas: 'Ágil: usa Destreza no dano' }],
    tecnicas: ['pisar-leve', 'esgueirar', 'bote-silencioso', 'manto-de-sombras'],
    notas: 'Bote Silencioso: +2d6 e ignora parte da Defesa contra alvo desavisado.' },

  { id: 'duelista', nome: 'Duelista', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'esgrimista exímio', descricao: 'Vive do duelo: apara, finta e responde com a ripose.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 5, vigor: 3 }, pericias: { 'armas-de-corte': 5, esquiva: 4, prontidao: 4 }, integridade: 5, vontade: 6,
    armadura: { soak: 2, prot: 1, esquiva: 0 },
    ataques: [{ nome: 'Florete (Ágil, Perf. 1)', atrib: 'destreza', pericia: 'armas-de-corte', dado: 1, mao: 1, tipo: 'perfurante', acerto: 2, pen: 1, ticks: 5 }],
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
    attrs: { forca: 4, destreza: 3, vigor: 5 }, pericias: { 'armas-de-corte': 4, esquiva: 3, escudos: 3, resistencia: 4, prontidao: 3 }, integridade: 6, vontade: 7,
    armadura: { soak: 6, prot: 3, esquiva: -2 },
    ataques: [{ nome: 'Montante', atrib: 'forca', pericia: 'armas-de-corte', dado: 3, mao: 2, tipo: 'corte', acerto: 0, ticks: 7 }],
    tecnicas: ['pele-curtida', 'aguentar-o-tranco', 'tensionar'],
    notas: 'Placa + Pele de Pedra: Soak altíssimo. Use Ruptura (Crush) ou dano pesado.' },

  { id: 'campeao', nome: 'Campeão (semideus menor)', tipo: 'chefe', ameaca: 6, centelha: 2,
    conceito: 'herói inimigo', descricao: 'Um adversário à altura dos PJs: rápido, forte e com Técnicas de herói.', tags: ['humano', 'centelha'],
    attrs: { forca: 4, destreza: 5, vigor: 4, carisma: 4 }, pericias: { 'armas-de-corte': 5, esquiva: 4, escudos: 3, prontidao: 5, intimidacao: 4, oratoria: 3 }, integridade: 6, vontade: 8,
    armadura: { soak: 4, prot: 2, esquiva: -1 },
    ataques: [{ nome: 'Espada longa (golpe duplo)', atrib: 'destreza', pericia: 'armas-de-corte', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6, notas: 'Pode dividir em 2 ataques (−1d6/−2d6)' }],
    tecnicas: ['golpe-pesado', 'quebrar-guarda', 'soco-trovejante'],
    notas: 'Energia ≈ Centelha×3 + Virtudes + Vontade. Reservar para Técnicas de banda 1–2.' },

  { id: 'lobo', nome: 'Lobo', tipo: 'fera', ameaca: 2, centelha: 0,
    conceito: 'predador de matilha', descricao: 'Rápido e implacável em grupo; ataca os flancos.', tags: ['fera'],
    attrs: { forca: 3, destreza: 4, vigor: 3, percepcao: 4 }, pericias: { briga: 3, esquiva: 3, prontidao: 4, furtividade: 3 }, integridade: 3, vontade: 4,
    ataques: [{ nome: 'Mordida', atrib: 'forca', pericia: 'briga', dado: 1, mao: 2, tipo: 'perfurante', acerto: 1, ticks: 5, notas: 'Em matilha: cerca e derruba' }],
    notas: 'Anda em matilha (3–6). Use Horda para grandes alcateias.' },

  { id: 'urso', nome: 'Urso', tipo: 'fera', ameaca: 4, centelha: 0,
    conceito: 'fera colossal', descricao: 'Força esmagadora e couro grosso; um perigo sério sozinho.', tags: ['fera'],
    attrs: { forca: 5, destreza: 2, vigor: 5, percepcao: 3 }, pericias: { briga: 3, resistencia: 4, prontidao: 3 }, integridade: 3, vontade: 5,
    armadura: { soak: 1, prot: 0, esquiva: 0 },
    ataques: [{ nome: 'Garras', atrib: 'forca', pericia: 'briga', dado: 2, mao: 2, tipo: 'corte', acerto: 1, ticks: 6, notas: 'Pode agarrar e esmagar' }],
    notas: 'Couro grosso (Soak natural alto pelo Vigor 5). Difícil de derrubar.' },

  { id: 'comandante', nome: 'Comandante Tocado', tipo: 'elite', ameaca: 5, centelha: 1,
    conceito: 'líder de guerra', descricao: 'Inspira tropas e quebra a moral inimiga; luta bem, mas comanda melhor.', tags: ['humano', 'centelha'],
    attrs: { forca: 3, destreza: 4, vigor: 4, carisma: 5 }, pericias: { 'armas-de-corte': 4, esquiva: 3, escudos: 3, oratoria: 4, tatica: 4, intimidacao: 4, prontidao: 3 }, integridade: 6, vontade: 7,
    armadura: { soak: 6, prot: 3, esquiva: -2 },
    ataques: [{ nome: 'Espada longa', atrib: 'destreza', pericia: 'armas-de-corte', dado: 2, mao: 1, tipo: 'corte', acerto: 1, ticks: 6 }],
    tecnicas: ['voz-de-lider', 'coordenar', 'tom-de-autoridade'],
    notas: 'Concede ações e bônus aos aliados (Estandarte/Comando). Some Carisma quando inspira. Mate-o e a tropa vacila.' },

  { id: 'cultista', nome: 'Cultista Sombrio', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'feiticeiro da morte', descricao: 'Servo de poderes proibidos; drena a vida e ergue os mortos.', tags: ['humano', 'centelha', 'arcano'],
    attrs: { forca: 2, destreza: 3, vigor: 3, manipulacao: 4, inteligencia: 3 }, pericias: { ocultismo: 4, esquiva: 2, prontidao: 2, manha: 3 }, integridade: 3, vontade: 7,
    ataques: [{ nome: 'Toque mórbido (Morte 1)', atrib: 'inteligencia', pericia: 'ocultismo', dado: 1, distancia: true, tipo: 'necrótico', ticks: 6, notas: 'Dreno: cura o cultista' }],
    artes: [{ id: 'morte', nivel: 2 }],
    notas: 'Mana 9. Em ritual, ergue um morto-vivo (Morte nível 3). Frágil no corpo a corpo.' },

  { id: 'esqueleto', nome: 'Esqueleto Guerreiro', tipo: 'soldado', ameaca: 2, centelha: 0,
    conceito: 'morto-vivo', descricao: 'Ossos animados que não sentem dor nem medo; lutam até despedaçar.', tags: ['morto-vivo'],
    attrs: { forca: 3, destreza: 3, vigor: 3 }, pericias: { 'armas-de-corte': 2, esquiva: 2, escudos: 1 }, integridade: 5, vontade: 5,
    armadura: { soak: 2, prot: 1 },
    ataques: [{ nome: 'Espada enferrujada', atrib: 'destreza', pericia: 'armas-de-corte', dado: 1, mao: 1, tipo: 'corte', acerto: 1, ticks: 5 }],
    notas: 'Morto-vivo: imune a medo, veneno e efeitos mentais. Dano de Impacto (esmagar ossos) é especialmente eficaz.' },

  { id: 'espectro', nome: 'Espectro', tipo: 'elite', ameaca: 4, centelha: 1,
    conceito: 'assombração incorpórea', descricao: 'Um morto que não partiu; atravessa paredes e gela a alma.', tags: ['morto-vivo', 'espírito'],
    attrs: { forca: 2, destreza: 4, vigor: 3, manipulacao: 4, percepcao: 4 }, pericias: { esquiva: 4, intimidacao: 4, furtividade: 5, prontidao: 4 }, integridade: 4, vontade: 8,
    ataques: [{ nome: 'Toque gélido', atrib: 'manipulacao', pericia: 'briga', dado: 2, mao: 2, tipo: 'necrótico (vs Def. Mental)', ticks: 5, notas: 'gela a vontade do alvo' }],
    notas: 'Incorpóreo: imune a dano físico não-mágico e atravessa matéria. Só Arcano, Proteção e armas encantadas o ferem.' },

  { id: 'ogro', nome: 'Ogro', tipo: 'chefe', ameaca: 5, centelha: 0,
    conceito: 'brutamontes monstruoso', descricao: 'Montanha de músculo e fúria; cada golpe é um aríete.', tags: ['fera', 'gigante'],
    attrs: { forca: 6, destreza: 2, vigor: 6 }, pericias: { briga: 3, 'armas-de-impacto': 3, resistencia: 4, intimidacao: 3 }, integridade: 3, vontade: 5,
    armadura: { soak: 2 },
    ataques: [{ nome: 'Clava enorme', atrib: 'forca', pericia: 'armas-de-impacto', dado: 3, mao: 2, tipo: 'impacto', acerto: 0, ticks: 7, notas: 'Ruptura; derruba o alvo' }],
    notas: 'Força e Vigor 6 (acima do humano). Lento (Speed 7) e de Defesa baixa: cerque e explore a lentidão.' },

  { id: 'aranha-gigante', nome: 'Aranha Gigante', tipo: 'fera', ameaca: 3, centelha: 0,
    conceito: 'predadora venenosa', descricao: 'Emboscadora de patas longas; uma picada e a presa amolece.', tags: ['fera'],
    attrs: { forca: 3, destreza: 4, vigor: 3, percepcao: 4 }, pericias: { briga: 3, furtividade: 4, esquiva: 3, prontidao: 4 }, integridade: 2, vontade: 4,
    ataques: [{ nome: 'Picada peçonhenta', atrib: 'destreza', pericia: 'briga', dado: 1, mao: 2, tipo: 'perfurante', acerto: 1, pen: 1, ticks: 5, notas: 'Veneno: Convicção+Vigor ou −2 em ações por uma cena' }],
    notas: 'Sobe paredes, ataca das sombras e prende a presa em teia.' },

  { id: 'mago-de-batalha', nome: 'Mago de Batalha', tipo: 'chefe', ameaca: 6, centelha: 2,
    conceito: 'artilharia arcana', descricao: 'Conjura fogo e força sobre o campo; perigoso a qualquer distância.', tags: ['humano', 'centelha', 'arcano'],
    attrs: { forca: 2, destreza: 3, vigor: 3, inteligencia: 5 }, pericias: { ocultismo: 5, esquiva: 3, prontidao: 3, conhecimentos: 3 }, integridade: 5, vontade: 8,
    ataques: [{ nome: 'Bola de fogo (Fogo 3)', atrib: 'inteligencia', pericia: 'ocultismo', dado: 3, distancia: true, tipo: 'fogo (área)', ticks: 6, notas: '3 Mana; explosão em área' }],
    artes: [{ id: 'fogo', nivel: 3 }, { id: 'forcas', nivel: 2 }],
    notas: 'Mana 12. Escudo de Força (Forças) o protege; Bola de Fogo atinge grupos. Feche a distância e quebre a concentração.' },
];

const inimigos = NPCS.map(stat);
fs.writeFileSync(path.join(ROOT, 'src/data/inimigos.json'), JSON.stringify(inimigos, null, 2) + '\n', 'utf8');
console.log(`inimigos.json: ${inimigos.length} NPCs.`);
for (const n of inimigos) console.log(`  ${n.nome} — PV ${n.pv} · Def ${n.defesa} · DefM ${n.defesaMental} · Soak ${n.soak.impacto}/${n.soak.letal} (Prot ${n.soak.protecao}) · Ini ${n.iniciativa}`);
