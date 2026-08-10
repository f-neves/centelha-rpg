// Leitura da ficha pelo lado do mestre.
//
// A ficha guarda o que o jogador comprou; o mestre precisa do que isso VIRA na
// mesa: as três Defesas, a Absorção por modo, a Iniciativa, os passivos que ele
// rola escondido. A conta é a mesma de `ficha-engine` (renderDerived), refeita
// aqui sem tocar no DOM — a engine inteira tem 156 KB e desenha uma ficha.
import {
  pv, energia, mana, folego, defesa, defesaSocial, defesaMental, pool, poolStr, regras,
  empilharArmaduras, soakNatural,
} from './calc';
import { armadurasDe } from './equip';
import { resumoCombatePC } from './combate-resumo';

export interface Passivo { id: string; nome: string; dados: number; bonus: number; media: number; str: string }

export interface ResumoFicha {
  nome: string; conceito: string; jogador: string; raca: string;
  centelha: number; vontade: number; aparencia: number;
  attrs: Record<string, number>; skills: Record<string, number>; skills2: Record<string, number>;
  virtudes: Record<string, number>;
  pv: number; energia: number; mana: number; folego: number;
  defEsquiva: number; defBloqueio: number; defSocial: number; defMental: number;
  soak: { impacto: number; corte: number; perfuracao: number }; resistPerf: number;
  penFisica: number;
  iniciativa: string; iniciativaMedia: number;
  arma: string; ataque: string; dano: string;
  passivos: Passivo[];
  tecnicas: string[]; artes: { id: string; nivel: number }[];
  armaduras: string[];
}

const media = (dados: number, bonus: number) => Math.round(dados * 3.5 + bonus);
function passivo(id: string, nome: string, atributo: number, habilidade: number): Passivo {
  const p = pool(atributo, habilidade);
  return { id, nome, dados: p.dados, bonus: p.bonus, media: media(p.dados, p.bonus), str: poolStr(atributo, habilidade) };
}

/** Tudo que o mestre precisa saber de um personagem, a partir do objeto S da ficha. */
export function resumoFicha(S: any): ResumoFicha {
  const A = (k: string) => (S?.attrs?.[k] || 0);
  const SK = (k: string) => (S?.skills?.[k] || 0);
  const SK2 = (k: string) => (S?.skills2?.[k] || 0);
  const C = S?.centelha || 0;
  const W = S?.willpower || 0;
  const vig = A('vigor'), dex = A('destreza');

  const armSt = empilharArmaduras(armadurasDe(S));
  const armPen = armSt.penalidade || 0;
  const cs = (regras.dano as { centelhaNoSoak?: number })?.centelhaNoSoak ?? 0;

  // A penalidade de escudo entra pela via do resumo de combate (que conhece o
  // conjunto em uso); aqui fica a de armadura, que vale sempre.
  let combate: any = null;
  try { combate = resumoCombatePC(S); } catch {}

  const ini = pool(A('raciocinio'), SK('prontidao'));

  const PASSIVOS: Passivo[] = [
    passivo('prontidao', 'Prontidão', Math.max(A('percepcao'), A('raciocinio')), SK('prontidao')),
    passivo('investigacao', 'Investigação', A('percepcao'), SK('investigacao')),
    passivo('empatia', 'Empatia', A('perspicacia'), SK('empatia')),
    passivo('furtividade', 'Furtividade', dex, SK('furtividade')),
    passivo('sobrevivencia', 'Sobrevivência', A('percepcao'), SK('sobrevivencia')),
    passivo('ocultismo', 'Ocultismo', A('inteligencia'), SK('ocultismo')),
    passivo('conhecimentos', 'Conhecimentos', A('inteligencia'), SK('conhecimentos')),
    passivo('atletismo', 'Atletismo', A('forca'), SK('atletismo')),
    passivo('resistencia', 'Resistência', vig, SK('resistencia')),
    passivo('integridade', 'Integridade', W, SK('integridade')),
  ];

  return {
    nome: S?.id?.nome || '', conceito: S?.id?.conceito || '', jogador: S?.id?.jogador || '',
    raca: S?.raca || '',
    centelha: C, vontade: W, aparencia: S?.aparencia || 0,
    attrs: S?.attrs || {}, skills: S?.skills || {}, skills2: S?.skills2 || {}, virtudes: S?.virtues || {},
    pv: pv(vig),
    energia: energia({ vigor: vig, compostura: A('compostura'), raciocinio: A('raciocinio'), vontade: W, centelha: C }),
    mana: mana({ centelha: C, vontade: W, manipulacao: S?.arte?.['manipulacao-mana'] || 0 }),
    folego: folego({ vigor: vig, resistencia: SK('resistencia'), vontade: W }),
    defEsquiva: combate?.defesa ?? (defesa({ destreza: dex, habilidade: SK('esquiva'), centelha: C }) - armPen),
    defBloqueio: defesa({ destreza: dex, habilidade: SK('bloqueio'), centelha: C }) - armPen,
    defSocial: defesaSocial({ compostura: A('compostura'), sociabilidade: SK('sociabilidade'), centelha: C }),
    defMental: defesaMental({ raciocinio: A('raciocinio'), integridade: SK('integridade'), vontade: W, centelha: C }),
    soak: combate?.soak ?? {
      impacto: soakNatural(vig, 'impacto') + C * cs + (armSt.soak.impacto || 0),
      corte: C * cs + (armSt.soak.corte || 0),
      perfuracao: C * cs + (armSt.soak.perfuracao || 0),
    },
    resistPerf: armSt.resistPerf || 0,
    penFisica: armPen,
    iniciativa: `${ini.dados}d6${ini.bonus ? ' +2' : ''}`,
    iniciativaMedia: media(ini.dados, ini.bonus),
    arma: combate?.arma || '', ataque: combate?.ataque || '', dano: combate?.dano || '',
    passivos: PASSIVOS,
    tecnicas: Object.keys(S?.tech || {}).filter((k) => S.tech[k]),
    artes: Object.entries(S?.arte || {}).filter(([, v]) => (v as number) > 0).map(([id, nivel]) => ({ id, nivel: nivel as number })),
    armaduras: (S?.equip?.armaduras || []).filter((p: any) => p?.vestida !== false).map((p: any) => p?.nome || p?.base || ''),
  };
}

/** Iniciativa rolada para um PC: 1d6 por dado do pool não — aqui é a regra da mesa (d6 + Raciocínio + Prontidão). */
export function rolarIniciativaPC(S: any) {
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  return d6() + (S?.attrs?.raciocinio || 0) + (S?.skills?.prontidao || 0);
}
